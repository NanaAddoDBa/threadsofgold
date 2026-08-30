"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  AuthErrorResponse,
  AuthRequestResult,
  AuthResponse,
  AuthUser,
  LoginCredentials,
  RegistrationDetails,
} from "@/types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthRequestResult>;
  register: (details: RegistrationDetails) => Promise<AuthRequestResult>;
  logout: () => Promise<boolean>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function readError(response: Response): Promise<AuthErrorResponse> {
  const fallback = { message: "Something went wrong. Please try again." };
  try {
    const data = (await response.json()) as Partial<AuthErrorResponse>;
    if (typeof data.message !== "string") return fallback;
    return data.fieldErrors
      ? { message: data.message, fieldErrors: data.fieldErrors }
      : { message: data.message };
  } catch {
    return fallback;
  }
}

async function submitAuthRequest(
  endpoint: string,
  payload: LoginCredentials | RegistrationDetails,
): Promise<AuthRequestResult> {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { ok: false, error: await readError(response) };
    }

    return { ok: true, data: (await response.json()) as AuthResponse };
  } catch {
    return {
      ok: false,
      error: {
        message: "The account service is unavailable. Please try again.",
      },
    };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session", {
        credentials: "same-origin",
        cache: "no-store",
      });
      const data = (await response.json()) as { user?: AuthUser | null };
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    void fetch("/api/auth/session", {
      credentials: "same-origin",
      cache: "no-store",
    })
      .then(
        (response) => response.json() as Promise<{ user?: AuthUser | null }>,
      )
      .then((data) => {
        if (isActive) setUser(data.user ?? null);
      })
      .catch(() => {
        if (isActive) setUser(null);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const result = await submitAuthRequest("/api/auth/login", credentials);
    if (result.ok) setUser(result.data.user);
    return result;
  }, []);

  const register = useCallback(async (details: RegistrationDetails) => {
    const result = await submitAuthRequest("/api/auth/register", details);
    if (result.ok) setUser(result.data.user);
    return result;
  }, []);

  const logout = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
      if (!response.ok) return false;
      setUser(null);
      return true;
    } catch {
      return false;
    }
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout, refreshSession }),
    [user, isLoading, login, register, logout, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider.");
  return context;
}
