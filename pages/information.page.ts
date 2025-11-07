import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./base.page";

/**
 * InformationPage - Page Object Model for SauceDemo Checkout Information Page
 * Extends BasePage to inherit common methods
 */
export class InformationPage extends BasePage {
  readonly url = "https://www.saucedemo.com/checkout-step-one.html";

  // Locators (Page Elements)
  readonly pageTitle: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly cancelBtn: Locator;
  readonly continueBtn: Locator;

  /**
   * Constructor - Initialize all locators
   * @param page - Playwright Page object
   */
  constructor(page: Page) {
    super(page); // Call parent class constructor

    // Define all page elements
    this.pageTitle = page.locator('[data-test="title"]');
    this.firstName = page.locator('[data-test="firstName"]');
    this.lastName = page.locator('[data-test="lastName"]');
    this.postalCode = page.locator('[data-test="postalCode"]');
    this.cancelBtn = page.locator('[data-test="cancel"]');
    this.continueBtn = page.locator('[data-test="continue"]');
  }

  /**
   * Navigate to Information page
   */
  async goto() {
    await this.page.goto(this.url);
    await this.page.waitForLoadState("domcontentloaded");
  }
  async verifyTitle(expectedTitle: string): Promise<void> {
    expect(this.pageTitle).toHaveText(expectedTitle);
  }
  /**
   * Fill the first name
   */
  async fillFirstName(firstName: string) {
    await this.fillInput(this.firstName, firstName);
  }
  /**
   * Fill the last name
   */
  async fillLastName(lastName: string) {
    await this.fillInput(this.lastName, lastName);
  }
  /**
   * Fill the postal code
   */
  async fillPostalCode(postalCode: string) {
    await this.fillInput(this.postalCode, postalCode);
  }
  /**
   * Continue shopping (go back to products page)
   */
  async continueShopping() {
    await this.clickElement(this.continueBtn);
    await this.verifyUrl("https://www.saucedemo.com/checkout-step-two.html");
  }

  /**
   * Continue shopping (go back to products page)
   */
  async moveBackToCart(): Promise<void> {
    await this.clickElement(this.cancelBtn);
    await this.verifyUrl("https://www.saucedemo.com/cart.html");
  }
}
