// cypress/e2e/login.cy.js

describe('Login Page Tests', function() {

  beforeEach(() => {
    cy.visit('/login');
  });

  it('1. Displays welcome title on the login page', () => {
    cy.contains(/¡Bienvenido de nuevo!/i).should('exist');
  });

  it('2. Displays Sign Up link on the login page', () => {
    cy.getDataTest('register-link').contains('Sign Up').should('exist');
  });

  it('3. Displays login image on the login page', () => {
    cy.getDataTest('login-image').should('exist');
  });

  it('4. Shows error for invalid login credentials', function() {
    const invalidUsername = 'nonexistentuser';
    const invalidPassword = 'wrongpassword';

    cy.get('body').should('not.contain.text', 'Credenciales inválidas');
    cy.getDataTest('username-input').type(invalidUsername);
    cy.getDataTest('password-input').type(invalidPassword);
    cy.getDataTest('login-button-container')
      .should('be.visible')
      .find('button')
      .contains('Iniciar sesión')
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    cy.contains('Credenciales inválidas').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('5. Successfully logs in with valid credentials via UI', function() {
    const validUsername = 'ana456'; 
    const validPassword = 'testpass456';
    cy.loginUI(validUsername, validPassword, false);
    cy.getDataTest('main-title').should('be.visible').and('contain.text', '¿Qué te apetece?');
  });

  it('6. Can access Home page after API login', function() {
    const validUsername = 'ana456';
    const validPassword = 'testpass456';

    cy.loginAPI(validUsername, validPassword);
    cy.visit('/main');
    cy.url().should('include', '/main');
    cy.getDataTest('main-title').should('be.visible').and('contain.text', '¿Qué te apetece?');
    cy.get('header').should('contain.text', 'Mi Perfil', { timeout: 10000 });
  });
});