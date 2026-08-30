export const principalKinds = ["customer", "staff", "service"] as const;

export type PrincipalKind = (typeof principalKinds)[number];

export interface AuthenticatedPrincipal {
  readonly subject: string;
  readonly kind: PrincipalKind;
  readonly roles: readonly string[];
}

export interface AuthorizationPolicy {
  allows(principal: AuthenticatedPrincipal, permission: string): boolean;
}
