import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

/**
 * LoginPage - Page Object Model for SauceDemo Login Page
 * Extends BasePage to inherit common methods
 */
export class LoginPage extends BasePage {
  // Page URL
  readonly url = "https://www.saucedemo.com/";

  // Locators (Page Elements)
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly logoImage: Locator;

  /**
   * Constructor - Initialize all locators
   * @param page - Playwright Page object
   */
  constructor(page: Page) {
    super(page); // Call parent class constructor

    // Define all page elements
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.logoImage = page.locator(".login_logo");
  }

  /**
   * Navigate to login page
   */
  async goto() {
    await this.navigate(this.url);
    await this.waitForPageLoad();
  }

  /**
   * Perform login action
   * @param username - Username to login
   * @param password - Password to login
   */
  async login(username: string, password: string) {
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  }

  /**
   * Enter username only
   * @param username - Username to enter
   */
  async enterUsername(username: string) {
    await this.fillInput(this.usernameInput, username);
  }

  /**
   * Enter password only
   * @param password - Password to enter
   */
  async enterPassword(password: string) {
    await this.fillInput(this.passwordInput, password);
  }

  /**
   * Click login button
   */
  async clickLogin() {
    await this.clickElement(this.loginButton);
  }

  /**
   * Get error message text
   * @returns Error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  /**
   * Check if error message is displayed
   * @returns boolean
   */
  async isErrorDisplayed(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  /**
   * Check if login page is loaded
   * @returns boolean
   */
  async isLoaded(): Promise<boolean> {
    return await this.isVisible(this.logoImage);
  }

  /**
   * Clear username field
   */
  async clearUsername() {
    await this.usernameInput.clear();
  }

  /**
   * Clear password field
   */
  async clearPassword() {
    await this.passwordInput.clear();
  }
}
