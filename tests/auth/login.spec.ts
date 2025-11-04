import { test, expect } from "../../fixtures/base";

/**
 * Login Test Suite
 * Tests for login functionality on SauceDemo
 */
test.describe("Login Tests", () => {
  /**
   * Before each test - Navigate to login page
   */
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  /**
   * Test 1: Successful login with valid credentials
   * @smoke - Mark as smoke test
   */
  test("should login successfully with valid credentials @smoke", async ({
    loginPage,
    page,
  }) => {
    // Arrange
    const username = "standard_user";
    const password = "secret_sauce";

    // Act
    await loginPage.login(username, password);

    // Assert
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.locator(".title")).toHaveText("Products");
  });

  /**
   * Test 2: Login should fail with invalid username
   */
  test("should show error with invalid username", async ({ loginPage }) => {
    // Arrange
    const username = "invalid_user";
    const password = "secret_sauce";

    // Act
    await loginPage.login(username, password);

    // Assert
    const isErrorDisplayed = await loginPage.isErrorDisplayed();
    expect(isErrorDisplayed).toBeTruthy();

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain("Username and password do not match");
  });

  /**
   * Test 3: Login should fail with invalid password
   */
  test("should show error with invalid password", async ({ loginPage }) => {
    // Arrange
    const username = "standard_user";
    const password = "wrong_password";

    // Act
    await loginPage.login(username, password);

    // Assert
    const isErrorDisplayed = await loginPage.isErrorDisplayed();
    expect(isErrorDisplayed).toBeTruthy();

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain("Username and password do not match");
  });

  /**
   * Test 4: Login should fail with empty username
   */
  test("should show error with empty username", async ({ loginPage }) => {
    // Arrange
    const password = "secret_sauce";

    // Act
    await loginPage.enterPassword(password);
    await loginPage.clickLogin();

    // Assert
    const isErrorDisplayed = await loginPage.isErrorDisplayed();
    expect(isErrorDisplayed).toBeTruthy();

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain("Username is required");
  });

  /**
   * Test 5: Login should fail with empty password
   */
  test("should show error with empty password", async ({ loginPage }) => {
    // Arrange
    const username = "standard_user";

    // Act
    await loginPage.enterUsername(username);
    await loginPage.clickLogin();

    // Assert
    const isErrorDisplayed = await loginPage.isErrorDisplayed();
    expect(isErrorDisplayed).toBeTruthy();

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain("Password is required");
  });

  /**
   * Test 6: Login should fail with locked user
   */
  test("should show error for locked out user @regression", async ({
    loginPage,
  }) => {
    // Arrange
    const username = "locked_out_user";
    const password = "secret_sauce";

    // Act
    await loginPage.login(username, password);

    // Assert
    const isErrorDisplayed = await loginPage.isErrorDisplayed();
    expect(isErrorDisplayed).toBeTruthy();

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain("this user has been locked out");
  });

  /**
   * Test 7: Verify login page is loaded correctly
   */
  test("should load login page correctly", async ({ loginPage, page }) => {
    // Assert
    const isLoaded = await loginPage.isLoaded();
    expect(isLoaded).toBeTruthy();

    await expect(page).toHaveTitle("Swag Labs");
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
