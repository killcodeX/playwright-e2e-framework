import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./base.page";

/**
 * ProductPage - Page Object Model for SauceDemo Product Page
 * Extends BasePage to inherit common methods
 */
export class ProductPage extends BasePage {
  // Page URL
  readonly url = "https://www.saucedemo.com/inventory.html";

  // Locators (Page Elements)
  readonly menuBtn: Locator;
  readonly menuItems: Locator;
  readonly menuCloseBtn: Locator;
  readonly cartBtn: Locator;
  readonly productSort: Locator;

  /**
   * Constructor - Initialize all locators
   * @param page - Playwright Page object
   */
  constructor(page: Page) {
    super(page); // Call parent class constructor

    // Define all page elements
    this.menuBtn = page.locator("#react-burger-menu-btn");
    this.menuItems = page.locator(".bm-menu-wrap");
    this.menuCloseBtn = page.locator("#react-burger-cross-btn");
    this.cartBtn = page.locator("#shopping_cart_container");
    this.productSort = page.locator('[data-test="product-sort-container"]');
  }

  /**
   * Navigate to product page
   */
  async goto() {
    await this.navigate(this.url);
    await this.waitForPageLoad();
  }
  /**
   * CLick to open Menu and wait till it is visible
   */
  async openMenu() {
    // Click the burger menu button to open the menu
    await this.clickElement(this.menuBtn);

    // Wait for the menu wrapper to become visible
    await this.menuItems.waitFor({ state: "visible", timeout: 5000 });

    // Optionally verify a menu item is visible
    await expect(this.menuItems).toBeVisible();
  }
  /**
   * Check if Menu items are visible
   * @returns boolean
   */
  async isMenuVisible(): Promise<boolean> {
    return await this.isVisible(this.menuItems);
  }
  /**
   * CLick to close the Menu
   */
  async closeMenu() {
    await this.page.waitForTimeout(1000); // wait 1s for animation to complete
    await expect(this.menuCloseBtn).toBeVisible({ timeout: 5000 });
    await this.clickElement(this.menuCloseBtn);
    await this.menuItems.waitFor({ state: "visible", timeout: 5000 });
  }
  /**
   * CLick on the menu button and wait tmenu to appear
   */
  async sortProduct(value: string) {
    return await this.selectByValue(this.productSort, value);
  }

  async getProductNames(): Promise<string[]> {
    return await this.page.locator(".inventory_item_name").allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const priceTexts = await this.page
      .locator(".inventory_item_price")
      .allTextContents();
    return priceTexts.map((price) => parseFloat(price.replace("$", "")));
  }

  async verifySortedByName(order: "asc" | "desc") {
    const names = await this.getProductNames();
    const sorted =
      order === "asc" ? [...names].sort() : [...names].sort().reverse();

    return names.every((name, i) => name === sorted[i]);
  }

  async verifySortedByPrice(order: "asc" | "desc") {
    const prices = await this.getProductPrices();
    const sorted =
      order === "asc"
        ? [...prices].sort((a, b) => a - b)
        : [...prices].sort((a, b) => b - a);

    return prices.every((price, i) => price === sorted[i]);
  }
}
