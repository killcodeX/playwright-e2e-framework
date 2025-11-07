import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./base.page";

/**
 * CartPage - Page Object Model for SauceDemo Cart Page
 * Extends BasePage to inherit common methods
 */
export class CartPage extends BasePage {
  readonly url = "https://www.saucedemo.com/cart.html";

  // Locators (Page Elements)
  readonly checkOutBtn: Locator;
  readonly cartItems: Locator;
  readonly continueShoppingBtn: Locator; // Good to have

  /**
   * Constructor - Initialize all locators
   * @param page - Playwright Page object
   */
  constructor(page: Page) {
    super(page); // Call parent class constructor

    // Define all page elements
    this.checkOutBtn = page.locator('[data-test="checkout"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.continueShoppingBtn = page.locator('[data-test="continue-shopping"]');
  }

  /**
   * Navigate to cart page
   */
  async goto() {
    await this.page.goto(this.url);
    await this.page.waitForLoadState("domcontentloaded");
  }

  /**
   * Click checkout button to proceed to checkout
   */
  async proceedToCheckout() {
    await this.clickElement(this.checkOutBtn);
  }

  /**
   * Check if any products are in the cart
   * @returns true if cart has items, false if empty
   */
  async hasItemsInCart(): Promise<boolean> {
    const count = await this.cartItems.count(); // ✅ Use .count() not .all().length
    return count > 0;
  }

  /**
   * Get the number of items in cart
   * @returns number of cart items
   */
  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  /**
   * Check if a specific product is in the cart
   * @param productName - Name of the product to check
   * @returns true if product is in cart
   */
  async isProductInCart(productName: string): Promise<boolean> {
    const product = this.page.locator(`[data-test="inventory-item"]`, {
      hasText: productName,
    });
    return await product.isVisible();
  }

  /**
   * Remove a product from cart
   * @param productSlug - Product slug (e.g., 'sauce-labs-backpack')
   */
  async removeProduct(productSlug: string) {
    const removeBtn = this.page.locator(`[data-test="remove-${productSlug}"]`);
    await removeBtn.click();
  }

  /**
   * Get all product names in cart
   * @returns Array of product names
   */
  async getProductNames(): Promise<string[]> {
    return await this.page
      .locator('[data-test="inventory-item-name"]')
      .allTextContents();
  }

  /**
   * Continue shopping (go back to products page)
   */
  async continueShopping() {
    await this.clickElement(this.continueShoppingBtn);
  }
}
