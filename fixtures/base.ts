import { test as base } from "@playwright/test";
import { LoginPage } from "@pages/login.page";
import { ProductPage } from "@pages/product.page";
import { CartPage } from "@pages/cart.page";
import { InformationPage } from "@pages/information.page";

/**
 * Custom test fixtures
 * This extends Playwright's test object with our page objects
 */
type MyFixtures = {
  loginPage: LoginPage;
  productPage: ProductPage;
  cartPage: CartPage;
  infoPage: InformationPage;
};

/**
 * Extended test object with custom fixtures
 * Use this 'test' in all test files instead of @playwright/test
 */
export const test = base.extend<MyFixtures>({
  /**
   * LoginPage fixture
   * Automatically creates LoginPage instance for each test
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  /**
   * productPage fixture
   * Automatically creates ProductPage instance for each test
   */
  productPage: async ({ page }, use) => {
    const productPage = new ProductPage(page);
    await use(productPage);
  },
  /**
   * cartPage fixture
   * Automatically creates CartPage instance for each test
   */
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  infoPage: async ({ page }, use) => {
    const infoPage = new InformationPage(page);
    await use(infoPage);
  },
});

/**
 * Export expect from Playwright
 */
export { expect } from "@playwright/test";
