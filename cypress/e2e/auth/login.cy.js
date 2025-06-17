// cypress/e2e/auth/login.cy.js

describe('Login Page Tests', () => {
  const VALID_USERNAME = 'ana456';
  const VALID_PASSWORD = 'testpass456';

  const INVALID_USERNAME = 'invaliduser';
  const INVALID_PASSWORD = 'wrongpassword';

  // Visit the login page before each test
  beforeEach(() => {
    cy.visit('/login');
  });

  it('1. Displays welcome title on the login page', () => {
    cy.contains(/¡Bienvenido de nuevo!/i).should('exist');
  });

  it('2. Displays Sign Up link on the login page', () => {
    cy.getDataTest('signup-link').contains('Sign Up').should('exist');
  });

  it('3. Displays login image on the login page', () => {
    cy.getDataTest('login-image').should('exist');
  });

  it('4. Shows error for invalid login credentials', () => {
    cy.get('body').should('not.contain.text', 'Credenciales inválidas');
    cy.getDataTest('username-input').type(INVALID_USERNAME);
    cy.getDataTest('password-input').type(INVALID_PASSWORD);
    cy.getDataTest('custom-button').contains('Iniciar sesión').click();
    cy.contains('Credenciales inválidas').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('5. Successfully logs in with valid credentials via UI', () => {
    cy.getDataTest('username-input').type(VALID_USERNAME);
    cy.getDataTest('password-input').type(VALID_PASSWORD);
    cy.getDataTest('custom-button').contains('Iniciar sesión').click();
    cy.url().should('not.include', '/login');
    cy.url().should('include', '/main');
    cy.contains('Welcome to your dashboard!').should('be.visible');
  });

  // Example of using the API login for faster test setup (if your loginAPI command works)
  it('6. Can access main page after API login', () => {
    cy.loginAPI(VALID_USERNAME, VALID_PASSWORD); // Use the API login command
    cy.visit('/main'); // Navigate to the protected page
    cy.url().should('include', '/main');
    // cy.contains('Welcome to your dashboard!').should('be.visible'); // Assert a dashboard element
  });
});