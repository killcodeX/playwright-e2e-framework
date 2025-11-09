import { test, expect } from "../../fixtures/base";

test.describe("Checkout Overview Page Tests", () => {
  test.beforeEach(async ({ loginPage, productPage, cartPage, infoPage }) => {
    // Login
    await loginPage.goto();
    await loginPage.login("standard_user", "secret_sauce");

    // Add products
    await productPage.addProductToCart("sauce-labs-backpack");
    await productPage.addProductToCart("sauce-labs-bike-light");

    // Go to cart and checkout
    await cartPage.goto();
    await cartPage.proceedToCheckout();

    // Fill information
    await infoPage.fillInformation("John", "Doe", "12345");
    await infoPage.continueToCheckout();
  });

  // ===================================
  // 1️⃣ VISUAL/UI TESTS
  // ===================================

  test("should display correct page title", async ({ checkoutPage }) => {
    await checkoutPage.verifyTitle("Checkout: Overview");
  });

  test("should display all required page elements", async ({
    checkoutPage,
  }) => {
    await checkoutPage.verifyPageElements();
  });

  test("should display payment information", async ({ checkoutPage }) => {
    const paymentInfo = await checkoutPage.getPaymentInfo();
    expect(paymentInfo).toBeTruthy();
    expect(paymentInfo.length).toBeGreaterThan(0);
  });

  test("should display shipping information", async ({ checkoutPage }) => {
    const shippingInfo = await checkoutPage.getShippingInfo();
    expect(shippingInfo).toBeTruthy();
    expect(shippingInfo.length).toBeGreaterThan(0);
  });

  // ===================================
  // 2️⃣ PRODUCT VERIFICATION TESTS
  // ===================================

  test("should display correct number of products", async ({
    checkoutPage,
  }) => {
    const count = await checkoutPage.getItemCount();
    expect(count).toBe(2);
  });

  test("should display correct product names", async ({ checkoutPage }) => {
    const hasBackpack = await checkoutPage.hasProductWithName(
      "Sauce Labs Backpack"
    );
    const hasBikeLight = await checkoutPage.hasProductWithName(
      "Sauce Labs Bike Light"
    );

    expect(hasBackpack).toBe(true);
    expect(hasBikeLight).toBe(true);
  });

  test("should display all added products", async ({ checkoutPage }) => {
    const productNames = await checkoutPage.getProductNames();

    expect(productNames).toEqual(
      expect.arrayContaining(["Sauce Labs Backpack", "Sauce Labs Bike Light"])
    );
  });

  test("should display correct product prices", async ({ checkoutPage }) => {
    const prices = await checkoutPage.getProductPrices();

    expect(prices).toContain(29.99); // Backpack price
    expect(prices).toContain(9.99); // Bike Light price
  });

  // ===================================
  // 3️⃣ PRICE CALCULATION TESTS
  // ===================================

  test("should display subtotal", async ({ checkoutPage }) => {
    const subtotal = await checkoutPage.getSubtotal();
    expect(subtotal).toBeGreaterThan(0);
  });

  test("should display tax amount", async ({ checkoutPage }) => {
    const tax = await checkoutPage.getTax();
    expect(tax).toBeGreaterThan(0);
  });

  test("should display total amount", async ({ checkoutPage }) => {
    const total = await checkoutPage.getTotal();
    expect(total).toBeGreaterThan(0);
  });

  test("should calculate subtotal correctly (sum of product prices)", async ({
    checkoutPage,
  }) => {
    const isCorrect = await checkoutPage.verifySubtotalMatchesProducts();
    expect(isCorrect).toBe(true);

    // OR more detailed:
    const prices = await checkoutPage.getProductPrices();
    const expectedSubtotal = prices.reduce((sum, price) => sum + price, 0);
    const actualSubtotal = await checkoutPage.getSubtotal();

    expect(actualSubtotal).toBeCloseTo(expectedSubtotal, 2);
  });

  test("should calculate total correctly (subtotal + tax)", async ({
    checkoutPage,
  }) => {
    const isCorrect = await checkoutPage.verifyTotalCalculation();
    expect(isCorrect).toBe(true);

    // OR more detailed:
    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();

    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  test("should calculate tax as approximately 8% of subtotal", async ({
    checkoutPage,
  }) => {
    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const expectedTax = subtotal * 0.08;

    // Tax should be close to 8% (with some tolerance)
    expect(tax).toBeCloseTo(expectedTax, 1);
  });

  // ===================================
  // 4️⃣ NAVIGATION TESTS
  // ===================================

  test("should navigate to complete page when finish clicked", async ({
    page,
    checkoutPage,
  }) => {
    await checkoutPage.finishOrder();

    await expect(page).toHaveURL(/checkout-complete/);
  });

  test("should navigate back to products when cancel clicked", async ({
    page,
    checkoutPage,
  }) => {
    await checkoutPage.cancel();

    await expect(page).toHaveURL(/inventory/);
  });

  test("should show confirmation after completing order", async ({
    page,
    checkoutPage,
  }) => {
    await checkoutPage.finishOrder();

    // Verify we're on complete page
    await expect(page).toHaveURL(/checkout-complete/);

    // Verify success message
    await expect(page.locator('[data-test="complete-header"]')).toHaveText(
      "Thank you for your order!"
    );
  });

  // ===================================
  // 5️⃣ EDGE CASES & VALIDATION
  // ===================================

  test("should handle single product checkout", async ({
    loginPage,
    productPage,
    cartPage,
    infoPage,
    checkoutPage,
  }) => {
    // Go back and start fresh with 1 product
    await productPage.goto();
    await productPage.addProductToCart("sauce-labs-backpack");
    await cartPage.goto();
    await cartPage.proceedToCheckout();
    await infoPage.fillInformation("Jane", "Smith", "54321");
    await infoPage.continueToCheckout();

    expect(await checkoutPage.getItemCount()).toBe(1);
    expect(await checkoutPage.verifyTotalCalculation()).toBe(true);
  });

  test("finish button should be enabled", async ({ checkoutPage, page }) => {
    const finishBtn = page.locator('[data-test="finish"]');
    await expect(finishBtn).toBeEnabled();
  });

  test("cancel button should be enabled", async ({ checkoutPage, page }) => {
    const cancelBtn = page.locator('[data-test="cancel"]');
    await expect(cancelBtn).toBeEnabled();
  });

  // ===================================
  // 6️⃣ SCREENSHOT TESTS
  // ===================================

  test("take screenshot of checkout overview", async ({
    page,
    checkoutPage,
  }) => {
    await page.screenshot({
      path: "screenshots/checkout/overview-page.png",
      fullPage: true,
    });
  });

  test("visual comparison - checkout summary", async ({
    page,
    checkoutPage,
  }) => {
    // Useful for visual regression testing
    await expect(page).toHaveScreenshot("checkout-overview.png", {
      fullPage: true,
      maxDiffPixels: 100, // Allow small differences
    });
  });

  // ===================================
  // 7️⃣ INTEGRATION TESTS
  // ===================================

  test("complete full checkout flow", async ({ page, checkoutPage }) => {
    // Verify we're on checkout overview
    await expect(page).toHaveURL(/checkout-step-two/);

    // Verify calculations
    expect(await checkoutPage.verifyTotalCalculation()).toBe(true);

    // Complete order
    await checkoutPage.finishOrder();

    // Verify success
    await expect(page).toHaveURL(/checkout-complete/);
    await expect(page.locator('[data-test="complete-header"]')).toBeVisible();
  });
});
