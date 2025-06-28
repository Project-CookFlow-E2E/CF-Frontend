describe('Home Page Tests', function() {

  before(() => {
    cy.viewport(1280, 800);
  });

  beforeEach(function() {
    cy.setupDashboardPage('ana456', 'testpass456');
  });

  it('1. Displays the main home page image', () => {
    cy.getDataTest('home-image')
      .should('be.visible')
      .and('have.attr', 'src', '/home-page.jpeg');
  });

  it('2. Displays the "Buscar" (Search) button in the header section', () => {
    cy.getDataTest('custom-button').contains('Buscar')
      .should('be.visible')
      .and('be.enabled');
  });

  it('3. Displays the welcome message with the user\'s name', () => {
    cy.getDataTest('firstname-text')
      .should('be.visible')
      .and('contain.text', 'Hola, Ana!');
  });

  it('4. Displays category filter badges and allows selection', () => {
    // Verify Category & Items List Visibility
    cy.getDataTest('category-list').should('be.visible');
    cy.getDataTest('badge-label').contains('Comida').should('exist')
      .and('have.class', 'bg-gray-200');
    cy.getDataTest('badge-label').contains('Desayuno').should('exist')
      .and('have.class', 'bg-gray-200');

    // Click 'Comida', assert selection
    cy.getDataTest('badge-label').contains('Comida').click();
    cy.getDataTest('badge-label').contains('Comida')
      .should('exist').and('have.class', 'bg-pink-500');

    // Click 'Desayuno', assert selection
    cy.getDataTest('badge-label').contains('Desayuno').click();
    cy.getDataTest('badge-label').contains('Desayuno')
      .should('exist').and('have.class', 'bg-pink-500');

    // On multi-selection, "Comida" should still be selected and styled
    cy.getDataTest('badge-label').contains('Comida').should('have.class', 'bg-pink-500');
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

  it('11. Navigation from header to "Cerrar Sesión" (Logout) works', () => {
    cy.logoutUI();
  });
});