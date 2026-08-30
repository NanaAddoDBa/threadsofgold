import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  { name: "home", path: "/" },
  { name: "collection", path: "/shop" },
  { name: "product detail", path: "/shop/independence-mesh-tee" },
  { name: "empty cart", path: "/cart" },
] as const;

for (const route of routes) {
  test(`${route.name} has no automatically detectable WCAG 2.2 A/AA violations`, async ({
    page,
  }, testInfo) => {
    await page.goto(route.path);

    const results = await new AxeBuilder({ page })
      .withTags([
        "wcag2a",
        "wcag2aa",
        "wcag21a",
        "wcag21aa",
        "wcag22a",
        "wcag22aa",
      ])
      .analyze();

    if (results.violations.length > 0) {
      await testInfo.attach("axe-violations", {
        body: Buffer.from(JSON.stringify(results.violations, null, 2)),
        contentType: "application/json",
      });
    }

    expect(
      results.violations,
      "Automated axe checks cover only detectable issues and do not establish full WCAG conformance.",
    ).toEqual([]);
  });
}
