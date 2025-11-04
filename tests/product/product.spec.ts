import { test, expect } from "../../fixtures/base";

/**
 * Login Test Suite
 * Tests for login functionality on SauceDemo
 */
test.describe("Product page Tests", () => {
  /**
   * Before each test - Navigate to Product page
   */
  test.beforeEach(async ({ loginPage, productPage, page }) => {
    console.log("🔐 Starting login...");
    await loginPage.goto();
    await loginPage.login("standard_user", "secret_sauce");

    console.log("📍 Current URL:", page.url()); // Check where you are

    console.log("📍 After goto URL:", page.url());
    // ✅ Optionally verify you're on the right page:
    await expect(page).toHaveURL(/inventory/);
  });

  test("should open menu", async ({ page, productPage }, testInfo) => {
    // check if the menu opens or not
    await productPage.openMenu();
  });

  test("should close menu", async ({ page, productPage }, testInfo) => {
    // first open the menu then close it,
    await productPage.openMenu();
    // check if the menu opens or not
    await productPage.closeMenu();
  });
});
