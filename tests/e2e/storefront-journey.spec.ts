import { expect, test } from "@playwright/test";

test("discovers a piece and retains selected preview options in the cart", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Express your unique style.",
    }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible({
    timeout: 30_000,
  });

  await page
    .getByRole("link", { name: "Explore the collection" })
    .first()
    .click();

  await expect(page).toHaveURL(/\/shop$/u);
  await expect(
    page.getByRole("heading", { level: 1, name: "The Collection" }),
  ).toBeVisible();

  await page
    .getByRole("link", { name: "View Independence Mesh Tee" })
    .first()
    .click();

  await expect(page).toHaveURL(/\/shop\/independence-mesh-tee$/u);
  await expect(
    page.getByRole("heading", { level: 1, name: "Independence Mesh Tee" }),
  ).toBeVisible();

  await page.getByRole("radio", { name: "Size M" }).click();
  await page.getByRole("radio", { name: "Colour Golden hour" }).click();
  await page
    .getByRole("button", {
      name: "Add Independence Mesh Tee with selected options to the preview cart",
    })
    .click();

  await expect(
    page.getByText("Added with your selected options."),
  ).toBeVisible();

  await page.getByRole("button", { name: "Open preview cart" }).click();

  const cartDialog = page.getByRole("dialog");
  await expect(
    cartDialog.getByText("Preview cart", { exact: true }),
  ).toBeVisible();
  await expect(cartDialog).toContainText("Independence Mesh Tee");
  await expect(cartDialog).toContainText("M");
  await expect(cartDialog).toContainText("Golden hour");

  await cartDialog.getByRole("link", { name: "Review selection" }).click();

  await expect(page).toHaveURL(/\/cart$/u);
  await expect(
    page.getByRole("heading", { level: 1, name: "Your selection" }),
  ).toBeVisible();
  await expect(page.getByText(/no payment will be taken/u)).toBeVisible();
});
