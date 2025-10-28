import { Page, Locator, expect } from "@playwright/test";

/**
 * BasePage - Parent class for all page objects
 * Contains common methods that all pages can use
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * @param path - URL path to navigate to
   */
  async navigate(path: string = "") {
    await this.page.goto(path);
  }

  /**
   * Wait for page to fully load
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Click on an element
   * @param locator - Playwright locator
   */
  async clickElement(locator: Locator) {
    await locator.waitFor({ state: "visible" });
    await locator.click();
  }

  /**
   * Fill text in an input field
   * @param locator - Playwright locator
   * @param text - Text to fill
   */
  async fillInput(locator: Locator, text: string) {
    await locator.waitFor({ state: "visible" });
    await locator.clear();
    await locator.fill(text);
  }

  /**
   * Get text content of an element
   * @param locator - Playwright locator
   * @returns Text content
   */
  async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: "visible" });
    return (await locator.textContent()) || "";
  }

  /**
   * Check if element is visible
   * @param locator - Playwright locator
   * @returns boolean
   */
  async isVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: "visible", timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for an element to be visible
   * @param locator - Playwright locator
   * @param timeout - Timeout in milliseconds
   */
  async waitForElement(locator: Locator, timeout: number = 10000) {
    await locator.waitFor({ state: "visible", timeout });
  }

  /**
   * Take a screenshot
   * @param name - Screenshot file name
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({
      path: `screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }

  /**
   * Get current page title
   * @returns Page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current page URL
   * @returns Current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Verify current URL matches expected
   * @param expectedUrl - Expected URL
   */
  async verifyUrl(expectedUrl: string) {
    await expect(this.page).toHaveURL(expectedUrl);
  }

  /**
   * Verify page title matches expected
   * @param expectedTitle - Expected title
   */
  async verifyTitle(expectedTitle: string) {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  /**
   * Select option from dropdown by visible text
   * @param locator - Dropdown locator
   * @param text - Visible text to select
   */
  async selectByText(locator: Locator, text: string) {
    await locator.selectOption({ label: text });
  }

  /**
   * Select option from dropdown by value
   * @param locator - Dropdown locator
   * @param value - Value to select
   */
  async selectByValue(locator: Locator, value: string) {
    await locator.selectOption({ value: value });
  }
}
