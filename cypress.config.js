// cypress.config.js
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // Use process.env.CYPRESS_BASE_URL, with a fallback for local development if not set
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:80', // Changed this line
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 800,
    video: false,
    screenshotOnRunFailure: false,
    defaultCommandTimeout: 5000,
    requestTimeout: 10000,
    setupNodeEvents(on, config) {
      config.env.API_URL = process.env.CYPRESS_API_URL || 'http://localhost:8000/api'; // Changed this line
      return config;
    },
  },
});