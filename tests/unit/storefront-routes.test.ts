import { describe, expect, it } from "vitest";

import {
  accountRouteWithReturnTo,
  parsePrototypeShopCategory,
  primaryNavigation,
  productRoute,
  shopRouteWithCategory,
  storefrontRoutes,
} from "../../apps/storefront/src/config/routes";

describe("storefront route configuration", () => {
  it("keeps primary navigation labels and destinations unique", () => {
    expect(new Set(primaryNavigation.map(({ label }) => label)).size).toBe(
      primaryNavigation.length,
    );
    expect(new Set(primaryNavigation.map(({ href }) => href)).size).toBe(
      primaryNavigation.length,
    );
  });

  it("encodes product slugs as one path segment", () => {
    expect(productRoute("gold crest/edition")).toBe(
      "/shop/gold%20crest%2Fedition",
    );
  });

  it("builds a category link accepted by the prototype parser", () => {
    const href = shopRouteWithCategory("Menswear");
    const category = new URL(
      href,
      "https://threadsofgold.test",
    ).searchParams.get("category");

    expect(href).toBe("/shop?category=menswear");
    expect(parsePrototypeShopCategory(category ?? undefined)).toBe("menswear");
  });

  it("falls back safely for unsupported prototype categories", () => {
    expect(parsePrototypeShopCategory("occasion-wear")).toBe("all");
    expect(parsePrototypeShopCategory(undefined)).toBe("all");
  });

  it("encodes an already-approved account return path", () => {
    expect(
      accountRouteWithReturnTo(
        storefrontRoutes.account.signIn,
        "/shop?category=tops&sort=featured",
      ),
    ).toBe("/account/sign-in?next=%2Fshop%3Fcategory%3Dtops%26sort%3Dfeatured");
  });
});
