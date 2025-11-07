import { test, expect } from "../../fixtures/base";

/**
 * Information Test Suite
 * Tests for information functionality on SauceDemo
 */
test.describe("Information page ", () => {
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
    // Check if cart has items
    const hasItems = await cartPage.hasItemsInCart();
    expect(hasItems).toBe(true);
    // Proceed to checkout
    await cartPage.proceedToCheckout();
  });

  test("Fill information and move forward to checkout", async ({ infoPage }) => {
    // verify the title
    await infoPage.verifyTitle("Checkout: Your Information");

    // fill first name
    await infoPage.fillFirstName("John");

    // fill last name
    await infoPage.fillLastName("Doe");

    // fill postal code
    await infoPage.fillPostalCode("12345");

    // move forward to checkout
    await infoPage.continueShopping();
  });

  test("Move back to cart page", async ({ infoPage }) => {
    // move forward to checkout
    await infoPage.moveBackToCart();
  });
});
