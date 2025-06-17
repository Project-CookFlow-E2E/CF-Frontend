// cypress/support/e2e.js

import './commands';

// Load users fixture globally for all specs
before(() => {
  cy.fixture('auth/users.json').as('users');
});

// Clear sessions globally after all tests are done
after(() => {
  Cypress.session.clearAllSavedSessions();
});
