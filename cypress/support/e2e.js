// cypress/support/e2e.js
import './commands';

before(() => {
  cy.fixture('auth/users.json').as('users');
});

after(() => {
  Cypress.session.clearAllSavedSessions();
});
