import users from "../test-data/users.json";
import products from "../test-data/products.json";
import forms from "../test-data/forms.json";
import api from "../test-data/api-endpoints.json";
import config from "../test-data/config.json";

type Environment = "dev" | "staging" | "production";
type InvalidUserType = "wrongPassword" | "nonExistent" | "invalidFormat";
type ContactType = "support" | "complaint";
type TimeoutType = "short" | "medium" | "long";
type ViewportType = "mobile" | "tablet" | "desktop";

export class TestDataHelper {
  // Get environment configuration
  static getEnvironment(
    env: Environment = (process.env.TEST_ENV as Environment) || "dev"
  ) {
    return config.environments[env];
  }

  // Get base URL for current environment
  static getBaseUrl() {
    return this.getEnvironment().baseUrl;
  }

  // Get API URL for current environment
  static getApiUrl() {
    return this.getEnvironment().apiUrl;
  }

  // User helpers
  static getValidUser() {
    return users.valid;
  }

  static getAdminUser() {
    return users.admin;
  }

  static getInvalidUser(type: InvalidUserType) {
    return users.invalid[type];
  }

  static getBulkUsers() {
    return users.bulk;
  }

  static getRandomBulkUser() {
    const randomIndex = Math.floor(Math.random() * users.bulk.length);
    return users.bulk[randomIndex];
  }

  // Product helpers
  static getElectronicsProducts() {
    return products.electronics;
  }

  static getClothingProducts() {
    return products.clothing;
  }

  static getProductById(id: string) {
    const allProducts = [
      ...products.electronics,
      ...products.clothing,
      products.outOfStock,
    ];
    return allProducts.find((p) => p.id === id);
  }

  static getOutOfStockProduct() {
    return products.outOfStock;
  }

  // Form data helpers
  static getValidRegistrationForm() {
    return forms.registration.valid;
  }

  static getContactForm(type: ContactType) {
    return forms.contact[type];
  }

  static getSearchQueries(type: "valid" | "noResults") {
    return type === "valid"
      ? forms.search.validQueries
      : forms.search.noResultsQueries;
  }

  // API helpers
  static getApiEndpoint(category: string, endpoint: string) {
    const endpoints = api.endpoints as any;
    return `${api.baseUrl}${endpoints[category]?.[endpoint] || ""}`;
  }

  static getApiHeaders() {
    return api.headers;
  }

  // Config helpers
  static getTimeout(type: TimeoutType) {
    return config.timeouts[type];
  }

  static getViewport(device: ViewportType) {
    return config.viewport[device];
  }

  // Generate unique test data
  static generateUniqueEmail(prefix: string = "test") {
    const timestamp = Date.now();
    return `${prefix}.${timestamp}@example.com`;
  }

  static generateUniqueUser() {
    return {
      ...users.valid,
      email: this.generateUniqueEmail("user"),
    };
  }
}

// Export for easier imports
export const testData = {
  users,
  products,
  forms,
  api,
  config,
};
