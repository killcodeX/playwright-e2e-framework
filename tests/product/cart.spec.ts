import { test, expect } from "../../fixtures/base";

/**
 * Login Test Suite
 * Tests for login functionality on SauceDemo
 */
test.describe("Cart page Tests", () => {
  /**
   * Before each test - Navigate to Product page
   */
  test.beforeEach(async ({ loginPage, productPage, cartPage, page }) => {
    console.log("🔐 Starting login...");
    await loginPage.goto();
    await loginPage.login("standard_user", "secret_sauce");

    console.log("📍 Current URL:", page.url()); // Check where you are

    console.log("📍 After goto URL:", page.url());
    // ✅ Optionally verify you're on the right page:
    await expect(page).toHaveURL(/inventory/);
    console.log("Adding product to the cart");
    // Add products
    await productPage.addProductToCart("sauce-labs-backpack");
    await productPage.addProductToCart("sauce-labs-bike-light");
    console.log("Now moving tot the Cart page");
    // Go to cart
    await cartPage.goto();
  });

  test("verify cart functionality", async ({ page, productPage, cartPage }) => {
    // Check if cart has items
    const hasItems = await cartPage.hasItemsInCart();
    expect(hasItems).toBe(true);

    // Check count
    const count = await cartPage.getCartItemCount();
    expect(count).toBe(2);

    // Get product names
    const products = await cartPage.getProductNames();
    console.log("Products in cart:", products);

    // Remove a product
    await cartPage.removeProduct("sauce-labs-backpack");

    // Verify count decreased
    expect(await cartPage.getCartItemCount()).toBe(1);

    // Proceed to checkout
    await cartPage.proceedToCheckout();
  });
});
