import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/login.page";

/**
 * Custom test fixtures
 * This extends Playwright's test object with our page objects
 */
type MyFixtures = {
  loginPage: LoginPage;
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
});

/**
 * Export expect from Playwright
 */
export { expect } from "@playwright/test";
