import "server-only";

import {
  randomBytes,
  randomUUID,
  scrypt as nodeScrypt,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

import { prototypeAuthConfig } from "@/config/auth";
import type { AuthUser, RegistrationDetails } from "@/types/auth";

const scrypt = promisify(nodeScrypt);
const passwordKeyLength = 64;
const sessionDurationMs = prototypeAuthConfig.sessionHours * 60 * 60 * 1000;

interface StoredUser extends AuthUser {
  passwordHash: string;
  passwordSalt: string;
  createdAt: number;
}

interface StoredSession {
  userId: string;
  expiresAt: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface PrototypeAuthStore {
  usersByEmail: Map<string, StoredUser>;
  usersById: Map<string, StoredUser>;
  sessions: Map<string, StoredSession>;
  rateLimits: Map<string, RateLimitEntry>;
  demoSeed?: Promise<void>;
}

declare global {
  var threadsOfGoldPrototypeAuthStore: PrototypeAuthStore | undefined;
}

function createPrototypeAuthStore(): PrototypeAuthStore {
  return {
    usersByEmail: new Map(),
    usersById: new Map(),
    sessions: new Map(),
    rateLimits: new Map(),
  };
}

const store: PrototypeAuthStore =
  globalThis.threadsOfGoldPrototypeAuthStore ?? createPrototypeAuthStore();
globalThis.threadsOfGoldPrototypeAuthStore = store;

export class EmailAlreadyRegisteredError extends Error {}

function toPublicUser(user: StoredUser): AuthUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };
}

async function derivePasswordHash(
  password: string,
  salt: string,
): Promise<Buffer> {
  return (await scrypt(password, salt, passwordKeyLength)) as Buffer;
}

async function buildStoredUser(
  details: Omit<RegistrationDetails, "consent">,
): Promise<StoredUser> {
  const passwordSalt = randomBytes(16).toString("base64");
  const passwordHash = await derivePasswordHash(details.password, passwordSalt);

  return {
    id: randomUUID(),
    firstName: details.firstName,
    lastName: details.lastName,
    email: details.email,
    passwordHash: passwordHash.toString("base64"),
    passwordSalt,
    createdAt: Date.now(),
  };
}

async function ensureDemoUser(): Promise<void> {
  if (store.usersByEmail.has(prototypeAuthConfig.demoEmail)) return;

  store.demoSeed ??= (async () => {
    const demoUser = await buildStoredUser({
      firstName: "Ama",
      lastName: "Preview",
      email: prototypeAuthConfig.demoEmail,
      password: prototypeAuthConfig.demoPassword,
    });
    store.usersByEmail.set(demoUser.email, demoUser);
    store.usersById.set(demoUser.id, demoUser);
  })();

  await store.demoSeed;
}

async function passwordMatches(
  user: StoredUser,
  password: string,
): Promise<boolean> {
  const actual = await derivePasswordHash(password, user.passwordSalt);
  const expected = Buffer.from(user.passwordHash, "base64");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function createPrototypeUser(
  details: RegistrationDetails,
): Promise<AuthUser> {
  await ensureDemoUser();
  if (store.usersByEmail.has(details.email)) {
    throw new EmailAlreadyRegisteredError();
  }

  const user = await buildStoredUser(details);
  store.usersByEmail.set(user.email, user);
  store.usersById.set(user.id, user);
  return toPublicUser(user);
}

export async function verifyPrototypeCredentials(
  email: string,
  password: string,
): Promise<AuthUser | null> {
  await ensureDemoUser();
  const user = store.usersByEmail.get(email);

  if (!user) {
    const demoUser = store.usersByEmail.get(prototypeAuthConfig.demoEmail);
    if (demoUser) await passwordMatches(demoUser, password);
    return null;
  }

  return (await passwordMatches(user, password)) ? toPublicUser(user) : null;
}

function removeExpiredSessions(): void {
  const now = Date.now();
  for (const [token, session] of store.sessions) {
    if (session.expiresAt <= now) store.sessions.delete(token);
  }
}

export function createPrototypeSession(userId: string): string {
  removeExpiredSessions();
  const token = randomBytes(32).toString("base64url");
  store.sessions.set(token, {
    userId,
    expiresAt: Date.now() + sessionDurationMs,
  });
  return token;
}

export function deletePrototypeSession(token: string | undefined): void {
  if (token) store.sessions.delete(token);
}

export function getPrototypeUserBySessionToken(
  token: string | undefined,
): AuthUser | null {
  if (!token) return null;
  removeExpiredSessions();
  const session = store.sessions.get(token);
  if (!session) return null;
  const user = store.usersById.get(session.userId);
  return user ? toPublicUser(user) : null;
}

export function checkPrototypeRateLimit(
  key: string,
  maxAttempts: number,
  windowMs = 15 * 60 * 1000,
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const existing = store.rateLimits.get(key);

  if (!existing || existing.resetAt <= now) {
    store.rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= maxAttempts) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((existing.resetAt - now) / 1000),
      ),
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function clearPrototypeRateLimit(key: string): void {
  store.rateLimits.delete(key);
}
