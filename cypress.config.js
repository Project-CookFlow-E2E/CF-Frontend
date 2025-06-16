// cypress.config.js
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // This is your React frontend's URL
    setupNodeEvents(on, config) {
      // It's good practice to log the resolved config and env vars
      console.log('Cypress Config:', config);
      console.log('Cypress Env:', config.env);
      return config;
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
  },
});