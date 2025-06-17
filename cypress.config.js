// cypress.config.js
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 800,
    video: false,
    screenshotOnRunFailure: false,
    defaultCommandTimeout: 5000,
    requestTimeout: 10000,
     env: {
      API_URL: 'http://127.0.0.1:8000/api'
    },
    setupNodeEvents(on, config) {
      return config;
    },
    
  },
});