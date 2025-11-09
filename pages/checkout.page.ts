import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./base.page";

/**
 * CheckoutPage - Page Object Model for SauceDemo Checkout Overview Page
 * Extends BasePage to inherit common methods
 */
export class CheckoutPage extends BasePage {
  readonly url = "https://www.saucedemo.com/checkout-step-two.html";

  // Locators (Page Elements)
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly totalLabel: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly finishBtn: Locator;
  readonly cancelBtn: Locator;
  readonly paymentInfoLabel: Locator;
  readonly shippingInfoLabel: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.locator('[data-test="title"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishBtn = page.locator('[data-test="finish"]');
    this.cancelBtn = page.locator('[data-test="cancel"]');
    this.paymentInfoLabel = page.locator('[data-test="payment-info-value"]');
    this.shippingInfoLabel = page.locator('[data-test="shipping-info-value"]');
  }

  async goto() {
    await this.page.goto(this.url);
    await this.page.waitForLoadState("domcontentloaded");
  }

  /**
   * Verify page title
   */
  async verifyTitle(expectedTitle: string): Promise<void> {
    await expect(this.pageTitle).toHaveText(expectedTitle);
  }

  /**
   * Get number of items in checkout
   */
  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  /**
   * Get all product names
   */
  async getProductNames(): Promise<string[]> {
    return await this.page.locator(".inventory_item_name").allTextContents();
  }

  /**
   * Get all product prices
   */
  async getProductPrices(): Promise<number[]> {
    const priceTexts = await this.page
      .locator(".inventory_item_price")
      .allTextContents();
    return priceTexts.map((price) => parseFloat(price.replace("$", "")));
  }

  /**
   * Get subtotal amount
   */
  async getSubtotal(): Promise<number> {
    const text = await this.subtotalLabel.textContent();
    const match = text?.match(/\$(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get tax amount
   */
  async getTax(): Promise<number> {
    const text = await this.taxLabel.textContent();
    const match = text?.match(/\$(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get total amount
   */
  async getTotal(): Promise<number> {
    const text = await this.totalLabel.textContent();
    const match = text?.match(/\$(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Verify total calculation (subtotal + tax = total)
   */
  async verifyTotalCalculation(): Promise<boolean> {
    const subtotal = await this.getSubtotal();
    const tax = await this.getTax();
    const total = await this.getTotal();
    const expectedTotal = subtotal + tax;

    // Allow small floating point difference
    return Math.abs(total - expectedTotal) < 0.01;
  }

  /**
   * Verify subtotal matches sum of product prices
   */
  async verifySubtotalMatchesProducts(): Promise<boolean> {
    const prices = await this.getProductPrices();
    const sumOfPrices = prices.reduce((sum, price) => sum + price, 0);
    const subtotal = await this.getSubtotal();

    return Math.abs(subtotal - sumOfPrices) < 0.01;
  }

  /**
   * Get payment information
   */
  async getPaymentInfo(): Promise<string> {
    return (await this.paymentInfoLabel.textContent()) || "";
  }

  /**
   * Get shipping information
   */
  async getShippingInfo(): Promise<string> {
    return (await this.shippingInfoLabel.textContent()) || "";
  }

  /**
   * Complete the order
   */
  async finishOrder() {
    await this.clickElement(this.finishBtn);
  }

  /**
   * Cancel and go back
   */
  async cancel() {
    await this.clickElement(this.cancelBtn);
  }

  /**
   * Check if product exists by name
   */
  async hasProductWithName(productName: string): Promise<boolean> {
    const names = await this.getProductNames();
    return names.includes(productName);
  }

  /**
   * Verify all elements are visible
   */
  async verifyPageElements(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.subtotalLabel).toBeVisible();
    await expect(this.taxLabel).toBeVisible();
    await expect(this.totalLabel).toBeVisible();
    await expect(this.finishBtn).toBeVisible();
    await expect(this.cancelBtn).toBeVisible();
  }
}
