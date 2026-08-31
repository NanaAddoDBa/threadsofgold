export const storefrontRoutes = {
  home: "/",
  shop: "/shop",
  brandStory: "/#the-house",
  cart: "/cart",
  checkoutPreview: "/checkout",
  account: {
    home: "/account",
    signIn: "/account/sign-in",
    register: "/account/register",
  },
} as const;

export type StorefrontRoute =
  | (typeof storefrontRoutes)[Exclude<keyof typeof storefrontRoutes, "account">]
  | (typeof storefrontRoutes.account)[keyof typeof storefrontRoutes.account];

export interface StorefrontNavigationItem {
  label: string;
  href: StorefrontRoute;
}

export const primaryNavigation = [
  { label: "Shop", href: storefrontRoutes.shop },
  { label: "The House", href: storefrontRoutes.brandStory },
] as const satisfies readonly StorefrontNavigationItem[];

export const prototypeShopCategoryRoutes = ["tops", "menswear"] as const;
export type PrototypeShopCategory =
  (typeof prototypeShopCategoryRoutes)[number];
export type PrototypeShopCategoryFilter = "all" | PrototypeShopCategory;

const prototypeCategoryRouteByLabel = {
  Tops: "tops",
  Menswear: "menswear",
} as const satisfies Readonly<Record<string, PrototypeShopCategory>>;

type PrototypeCategoryLabel = keyof typeof prototypeCategoryRouteByLabel;

export function productRoute(slug: string): string {
  return `${storefrontRoutes.shop}/${encodeURIComponent(slug)}`;
}

export function parsePrototypeShopCategory(
  value: string | undefined,
): PrototypeShopCategoryFilter {
  return prototypeShopCategoryRoutes.includes(value as PrototypeShopCategory)
    ? (value as PrototypeShopCategory)
    : "all";
}

export function shopRouteWithCategory(
  category: PrototypeCategoryLabel,
): string {
  const search = new URLSearchParams({
    category: prototypeCategoryRouteByLabel[category],
  });
  return `${storefrontRoutes.shop}?${search.toString()}`;
}

export function accountRouteWithReturnTo(
  route:
    | typeof storefrontRoutes.account.signIn
    | typeof storefrontRoutes.account.register,
  returnTo: string,
): string {
  return `${route}?next=${encodeURIComponent(returnTo)}`;
}
