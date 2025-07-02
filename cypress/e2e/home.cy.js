// cypress/e2e/home.cy.js
describe('Home Page Tests', function () {
  before(() => {
    cy.viewport(1280, 800);
  });
  console.log('Running tests for Home Page');
  

  beforeEach(function () {
    cy.setupHomePage('ana456', 'testpass456');
    cy.intercept('GET', '/api/recipes/categories/').as('getCategories');
    cy.intercept('GET', '/api/recipes/latest/').as('getLatestRecipes');
    cy.wait('@getCategories', { timeout: 15000 });
    cy.wait('@getLatestRecipes', { timeout: 15000 });
  });

  it('1. Displays the main home page image', () => {
    cy.getDataTest('home-image')
      .should('be.visible')
      .and('have.attr', 'src', '/home-page.jpeg');
  });

  it("2. Displays the welcome message with the user's name", () => {
    cy.getDataTest('firstname-text')
      .should('be.visible')
      .and('contain.text', 'Hola, Ana!');
  });

  it('3. Displays category filter badges and allows selection', () => {
    cy.getDataTest('category-list').should('be.visible');

    cy.getDataTest('badge-label').contains('Comida').as('comidaBadge');
    cy.getDataTest('badge-label').contains('Desayuno').as('desayunoBadge');

    cy.get('@comidaBadge').should('have.class', 'bg-gray-200');
    cy.get('@desayunoBadge').should('have.class', 'bg-gray-200');

    cy.get('@comidaBadge').click().should('have.class', 'bg-pink-500');
    cy.get('@desayunoBadge').click().should('have.class', 'bg-pink-500');

    cy.get('@comidaBadge').should('have.class', 'bg-pink-500');

    cy.getDataTest('search-button').click();
    cy.url().should('include', '/search');
  });

  it('5. Displays the "Últimas recetas" (Latest Recipes) section title', () => {
    cy.getDataTest('latest-recipes-section')
      .scrollIntoView()
      .should('be.visible');
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
    cy.getDataTest('inspire-button')
      .should('be.visible')
      .and('not.be.disabled');
  });

  it('9. Displays all main footer navigation links', () => {
    cy.getDataTest('footer')
      .should('be.visible')
      .within(() => {
        cy.getDataTest('footer-link-search')
          .should('be.visible')
          .and('have.attr', 'href', '/search');
        cy.getDataTest('footer-label-search').should('contain.text', 'Buscar');

        cy.getDataTest('footer-link-add-recipe')
          .should('be.visible')
          .and('have.attr', 'href', '/add-recipe');
        cy.getDataTest('footer-label-add-recipe').should(
          'contain.text',
          'Nueva Receta'
        );

        cy.getDataTest('footer-link-shopping-list')
          .should('be.visible')
          .and('have.attr', 'href', '/shopping-list');
        cy.getDataTest('footer-label-shopping-list').should(
          'contain.text',
          'Cesta'
        );
      });
  });

  it('10. Navigation from header to "Mi Perfil" (My Profile) works', () => {
    cy.getDataTest('profile-button')
      .should('contain.text', 'Mi Perfil')
      .click();
    cy.url().should('include', '/profile');
  });

  it('11. Navigation from header to "Cerrar Sesión" (Logout) works', () => {
    cy.logoutUI();
  });
});
