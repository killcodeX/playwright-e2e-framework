# 🎭 Playwright E2E Testing Framework

A comprehensive end-to-end testing framework built with **Playwright** and **TypeScript** using industry-standard **Page Object Model (POM)** design pattern.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Configuration](#configuration)
- [Reporting](#reporting)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)

---

## ✨ Features

- ✅ **Page Object Model (POM)** - Modular and maintainable test architecture
- ✅ **TypeScript** - Type-safe code with IntelliSense support
- ✅ **Custom Fixtures** - Reusable test setup and teardown
- ✅ **Multi-Browser Support** - Chrome, Firefox, Safari, Mobile
- ✅ **Parallel Execution** - Fast test execution
- ✅ **Multiple Reporters** - HTML, JSON, JUnit, Allure
- ✅ **Screenshot & Video** - Captured on test failures
- ✅ **CI/CD Ready** - GitHub Actions, Jenkins compatible
- ✅ **Tagged Tests** - Run specific test suites (@smoke, @regression)

---

## 🛠️ Tech Stack

| Technology     | Version  | Purpose                   |
| -------------- | -------- | ------------------------- |
| **Playwright** | ^1.40.0  | Test automation framework |
| **TypeScript** | ^5.3.0   | Programming language      |
| **Node.js**    | >=18.0.0 | Runtime environment       |
| **Allure**     | ^2.15.1  | Advanced reporting        |

---

## 📁 Project Structure

```
playwright-e2e-framework/
│
├── pages/                          # Page Object Models
│   ├── base.page.ts               # Base page with common methods
│   └── login.page.ts              # Login page object
│
├── tests/                          # Test specifications
│   └── auth/
│       └── login.spec.ts          # Login test cases
│
├── fixtures/                       # Test fixtures
│   └── base.test.ts               # Custom test setup
│
├── utils/                          # Utility functions
│   └── (helpers, test data)
│
├── config/                         # Configuration files
│   └── (environments, test data)
│
├── screenshots/                    # Test failure screenshots
├── test-results/                   # Test execution results
├── playwright-report/              # HTML reports
│
├── playwright.config.ts           # Playwright configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies
└── .gitignore                     # Git ignore rules
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)

Check your installation:

```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
```

---

## 🚀 Installation

### Step 1: Clone the repository

```bash
git clone <your-repo-url>
cd playwright-e2e-framework
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Install Playwright browsers

```bash
npx playwright install
```

### Step 4: Verify installation

```bash
npx playwright --version
```

---

## 🧪 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run all tests (alternative)
npx playwright test

# Run specific test file
npx playwright test tests/auth/login.spec.ts

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests in UI mode (interactive)
npm run test:ui

# Run tests in debug mode
npm run test:debug
```

### Browser-Specific Tests

```bash
# Run on Chrome only
npm run test:chrome

# Run on Firefox only
npm run test:firefox

# Run on Safari only
npm run test:safari
```

### Tagged Tests

```bash
# Run smoke tests only
npm run test:smoke

# Run regression tests only
npm run test:regression
```

### Parallel Execution

```bash
# Run tests in parallel (4 workers)
npm run test:parallel

# Or specify custom workers
npx playwright test --workers=8
```

---

## ✍️ Writing Tests

### Example Test Structure

```typescript
import { test, expect } from '../../fixtures/base.test'

test.describe('Feature Name', () => {
  test.beforeEach(async ({ loginPage }) => {
    // Setup before each test
    await loginPage.goto()
  })

  test('should perform action successfully @smoke', async ({
    loginPage,
    page
  }) => {
    // Arrange - Setup test data
    const username = 'standard_user'
    const password = 'secret_sauce'

    // Act - Perform action
    await loginPage.login(username, password)

    // Assert - Verify result
    await expect(page).toHaveURL(/.*inventory.html/)
  })
})
```

### Creating a New Page Object

```typescript
// pages/products.page.ts
import { Page, Locator } from '@playwright/test'
import { BasePage } from './base.page'

export class ProductsPage extends BasePage {
  readonly productTitle: Locator

  constructor(page: Page) {
    super(page)
    this.productTitle = page.locator('.title')
  }

  async getTitle(): Promise<string> {
    return await this.getText(this.productTitle)
  }
}
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
BASE_URL=https://www.saucedemo.com
ENV=staging
HEADLESS=true
```

### Playwright Configuration

Edit `playwright.config.ts` to customize:

```typescript
export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  retries: 2,
  workers: 4,
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  }
})
```

---

## 📊 Reporting

### HTML Report (Default)

```bash
# Generate and open HTML report
npm run report
```

### Allure Report

```bash
# Generate Allure report
npm run allure:generate

# Open Allure report
npm run allure:open
```

### Test Results Location

- **HTML Report**: `playwright-report/index.html`
- **JSON Results**: `test-results/results.json`
- **JUnit XML**: `test-results/junit.xml`
- **Screenshots**: `screenshots/`
- **Videos**: `test-results/`

---

## 🔄 CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/tests.yml`:

```yaml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run tests
        run: npm test

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 🎯 Best Practices

### 1. **Test Independence**

- Each test should run independently
- Don't depend on other tests
- Use `beforeEach` for setup

### 2. **Use Page Objects**

- Keep locators in page objects
- Reuse methods across tests
- Follow single responsibility principle

### 3. **Meaningful Test Names**

```typescript
// ✅ Good
test('should display error when login with invalid credentials')

// ❌ Bad
test('test1')
```

### 4. **AAA Pattern**

```typescript
test('example', async () => {
  // Arrange - Setup
  const data = 'test'

  // Act - Perform action
  await page.click('button')

  // Assert - Verify
  expect(result).toBe(expected)
})
```

### 5. **Use Tags**

```typescript
test('critical test @smoke', async () => {})
test('full test @regression', async () => {})
```

### 6. **Wait Strategies**

```typescript
// ✅ Good - Wait for element
await page.waitForSelector('.element')

// ❌ Bad - Hard wait
await page.waitForTimeout(5000)
```

---

## 🐛 Debugging

### Debug Mode

```bash
# Run with debugger
npx playwright test --debug

# Debug specific test
npx playwright test tests/auth/login.spec.ts --debug
```

### Trace Viewer

```bash
# Open trace for failed test
npx playwright show-trace test-results/traces/trace.zip
```

### Screenshots

- Automatically captured on failure
- Located in `screenshots/` folder

---

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👤 Author

**Aaquib Ahmad**

- GitHub: [@killcodex](https://github.com/killcodex)
- LinkedIn: [My Profile](https://linkedin.com/in/aaquib-ahmed)

---

## 🙏 Acknowledgments

- Playwright Team for the amazing framework
- SauceDemo for providing test application

---

**Happy Testing! 🚀**
