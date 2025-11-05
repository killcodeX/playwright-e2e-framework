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

  test("sort product by Name (A to Z)", async ({ page, productPage }) => {
    await productPage.sortProduct("az");

    const isSorted = await productPage.verifySortedByName("asc");
    expect(isSorted).toBe(true);
  });

  test("sort product by Name (Z to A)", async ({ page, productPage }) => {
    await productPage.sortProduct("za");

    const isSorted = await productPage.verifySortedByName("desc");
    expect(isSorted).toBe(true);
  });

  test("sort product by Price (low to high)", async ({ page, productPage }) => {
    await productPage.sortProduct("lohi");
    const isSorted = await productPage.verifySortedByPrice("asc");
    expect(isSorted).toBe(true);
  });

  test("sort product by Price (high to low)", async ({ page, productPage }) => {
    await productPage.sortProduct("hilo");
    const isSorted = await productPage.verifySortedByPrice("desc");
    expect(isSorted).toBe(true);
  });

  test("add specific products to cart", async ({ productPage }) => {
    await productPage.addProductToCart("sauce-labs-backpack");
    await productPage.addProductToCart("sauce-labs-bike-light");

    // Verify these specific products are in cart
    expect(await productPage.isProductInCart("sauce-labs-backpack")).toBe(true);
  });
});
