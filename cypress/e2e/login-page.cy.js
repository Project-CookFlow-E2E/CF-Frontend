// cypress/e2e/login-page.cy.js

describe('Login Page Test', () => {

  const TEST_USERNAME = 'mario789';
  const TEST_PASSWORD = 'testpass789';

  it.only('Test UI login with valid username and password', () => {
    cy.visit('/login');
    cy.get('[data-testid="username-input"]').type(TEST_USERNAME);
    cy.get('[data-testid="password-input"]').type(TEST_PASSWORD);
    cy.get('[data-testid="custom-button"]').contains('Iniciar sesión').click()
    cy.url().should('not.include', '/login');
    cy.url().should('include', '/main');
  })
  
})
