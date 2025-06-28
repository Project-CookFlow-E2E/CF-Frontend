// cypress.config.js
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://frontend:80',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 800,
    video: false,
    screenshotOnRunFailure: false,
    defaultCommandTimeout: 5000,
    requestTimeout: 10000,
    setupNodeEvents(on, config) {
      config.env.API_URL = process.env.CYPRESS_API_URL;
      return config;
    },
  },
});