// cypress/e2e/auth/login.cy.js

describe('Login Page Tests', () => {
  let users;

  before(() => {
    Cypress.session.clearAllSavedSessions();
    cy.fixture('auth/users.json').then((data) => {
      users = data;
    });
  });

  after(() => {
    Cypress.session.clearAllSavedSessions();
  });


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
    const invalidUser = users.find(u => u.username === 'invaliduser');
    cy.get('body').should('not.contain.text', 'Credenciales inválidas');
    cy.getDataTest('username-input').type(invalidUser.username);
    cy.getDataTest('password-input').type(invalidUser.password);
    cy.getDataTest('custom-button').contains('Iniciar sesión').click();
    cy.contains('Credenciales inválidas').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('5. Successfully logs in with valid credentials via UI', () => {
    const validUser = users.find(u => u.username === 'ana456');
    cy.loginUI(validUser.username, validUser.password, false);
    cy.contains('¿Qué te apetece?').should('be.visible');
  });

  it('6. Can access Home page after API login', () => {
    const validUser = users.find(u => u.username === 'ana456');
    cy.loginAPI(validUser.username, validUser.password);
    cy.visit('/main');
    cy.url().should('include', '/main');
    cy.contains('¿Qué te apetece?').should('be.visible');
  });
});