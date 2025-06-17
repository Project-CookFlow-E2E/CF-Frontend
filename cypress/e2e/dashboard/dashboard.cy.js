// cypress/e2e/dashboard/dashboard.cy.js

describe('Dashboard/Home Page Tests', () => {
  let users;

  before(() => {
    cy.viewport(1280, 800);
    Cypress.session.clearAllSavedSessions();
    cy.fixture('auth/users.json').then((data) => {
      users = data;
    });
  });

  after(() => {
    Cypress.session.clearAllSavedSessions();
  });

  beforeEach(() => {
    const validUser = users.find(u => u.username === 'ana456');

    cy.loginAPI(validUser.username, validUser.password);
    cy.intercept('GET', `${Cypress.env('API_URL')}/users/me/`, {
      statusCode: 200,
      body: {
        id: 2,
        username: validUser.username,
        email: 'ana456@example.com',
        first_name: 'Ana',
        last_name: ''
      },
      delay: 50
    }).as('getUserMe');

    cy.visit('/main');
    cy.wait('@getUserMe');
    cy.get('header').should('be.visible');
    cy.get('header').should('contain.text', 'Mi Perfil', { timeout: 10000 });
    cy.getDataTest('footer-link-search').should('be.visible').and('contain.text', 'Buscar');
    cy.getDataTest('main-title').should('be.visible').and('contain.text', '¿Qué te apetece?');
  });

  it('1. Displays the welcome message with the user\'s name', () => {
    cy.getDataTest('prompt-text')
      .should('be.visible')
      .and('contain.text', 'Hola, Ana!');
  });

  it('2. Displays the main home page image', () => {
    cy.getDataTest('home-image')
      .should('be.visible')
      .and('have.attr', 'src', '/home-page.jpeg');
  });

  it('3. Displays category filter badges and allows selection', () => {
    cy.getDataTest('category-list').should('be.visible');
    cy.getDataTest('category-badge-Comida').should('exist');
    cy.getDataTest('badge-label').contains('Comida').should('be.visible');
    cy.getDataTest('badge-label').contains('Comida').click();
    cy.getDataTest('category-badge-Comida').should('be.checked');
    cy.getDataTest('badge-label').contains('Desayuno').click();
    cy.getDataTest('category-badge-Desayuno').should('be.checked');
    cy.getDataTest('category-badge-Comida').should('be.checked');
  });

  it('4. Displays the "Buscar" (Search) button in the header section', () => {
    cy.getDataTest('custom-button').contains('Buscar')
      .should('be.visible')
      .and('be.enabled');
  });

  it('5. Displays the "Últimas recetas" (Latest Recipes) section title', () => {
    cy.getDataTest('latest-recipes-section').scrollIntoView().should('be.visible');
    cy.getDataTest('latest-recipes-title')
      .should('be.visible')
      .and('contain.text', 'Últimas recetas');
  });

  it('6. Displays at least two recipe cards in the "Latest Recipes" section', () => {
    cy.getDataTest('latest-recipes-list')
      .should('be.visible')
      .find('[data-testid="main-card-container"]')
      .should('have.length.of.at.least', 2);
  });

  it('7. Each recipe card displays a title, category, and timer', () => {
    cy.getDataTest('latest-recipes-list')
      .find('[data-testid="main-card-container"]')
      .each(($card) => {
        cy.wrap($card).getDataTest('card-title').should('not.be.empty');
        cy.wrap($card).getDataTest('card-category').should('not.be.empty');
        cy.wrap($card).getDataTest('timer-badge').should('not.be.empty');
      });
  });

  it('8. Displays the "Inspire me" section title and button', () => {
    cy.getDataTest('inspire-section').scrollIntoView().should('be.visible');
    cy.getDataTest('inspire-title')
      .should('be.visible')
      .and('contain.text', '¿Aún no sabes que hacer?');
    cy.getDataTest('custom-button').contains('Inspire me')
      .should('be.visible')
      .and('not.be.disabled');
  });

  it('9. Displays all main footer navigation links', () => {
    cy.getDataTest('footer').should('be.visible');

    cy.getDataTest('footer-link-search').should('be.visible').and('have.attr', 'href', '/search');
    cy.getDataTest('footer-label-search').should('contain.text', 'Buscar');

    cy.getDataTest('footer-link-add-recipe').should('be.visible').and('have.attr', 'href', '/add-recipe');
    cy.getDataTest('footer-label-add-recipe').should('contain.text', 'Nueva Receta');

    cy.getDataTest('footer-link-shopping-list').should('be.visible').and('have.attr', 'href', '/shopping-list');
    cy.getDataTest('footer-label-shopping-list').should('contain.text', 'Cesta');
  });

  it('10. Navigation from header to "Mi Perfil" (My Profile) works', () => {
    cy.getDataTest('custom-button')
      .contains('Mi Perfil')
      .should('be.visible')
      .click();
    cy.url().should('include', '/profile');
  });

  it.only('11. Navigation from header to "Cerrar Sesión" (Logout) works', () => {
    cy.getDataTest('custom-button')
      .contains('Cerrar Sesión')
      .should('be.visible')
      .and('be.enabled')
      .click();
    cy.url().should('include', '/');
    cy.getDataTest('hero-subtitle')
      .should('include.text', 'Redescubre el placer de cocinar')
      .and('be.visible');
  });
});