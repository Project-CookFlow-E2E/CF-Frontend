// cypress/e2e/login-page.cy.js

describe('Login Page Tests', () => {
  const TEST_USERNAME = 'mario789';
  const TEST_PASSWORD = 'testpass789';

  beforeEach(() => {
    cy.visit('/login');
  });

  it('Displays welcome title on the login page', () => {
    cy.contains(/¡Bienvenido de nuevo!/i).should('exist');
  });

  it('Displays Sign Up link on the login page', () => {
    cy.getDataTest('signup-link').contains('Sign Up').should('exist');
  });

  it('Displays login image on the login page', () => {
    cy.getDataTest('login-image').should('exist');
  });

  it('Successfully logs in with valid username and password', () => {
    cy.get('[data-testid="username-input"]').type(TEST_USERNAME);
    cy.get('[data-testid="password-input"]').type(TEST_PASSWORD);
    cy.get('[data-testid="custom-button"]').contains('Iniciar sesión').click();
    cy.url().should('not.include', '/login');
    cy.url().should('include', '/main');
  });

  it('Shows error for invalid login credentials', () => {
    cy.get('body').should('not.contain.text', 'Credenciales inválidas');
    cy.getDataTest('username-input').type('invalid');
    cy.getDataTest('password-input').type('invalid');
    cy.getDataTest('custom-button').contains('Iniciar sesión').click();
    cy.contains('Credenciales inválidas').should('be.visible');
    cy.url().should('include', '/login');
  });
});