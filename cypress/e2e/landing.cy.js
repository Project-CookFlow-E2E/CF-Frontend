describe('Landing Page Tests (Mocked API - UI Presence Focused)', function() {

  beforeEach(() => {
    cy.intercept('GET', '/api/recipes/recipes/?ordering=-created_at&limit=32', { fixture: 'recipes/latest_recipes.json' }).as('getLatestRecipes');
    cy.visit('/');
  });

  it('1. Displays the main hero section with title, subtitle, and register link', () => {
    cy.getDataTest('hero-section').should('be.visible');
    cy.getDataTest('hero-title').should('be.visible').and('contain.text', 'CookFlow');
    cy.getDataTest('hero-subtitle').should('be.visible').and('contain.text', 'Redescubre el placer de cocinar');
    cy.getDataTest('hero-register-link')
      .should('be.visible')
      .and('have.attr', 'href', '/login')
      .find('button')
      .should('contain.text', 'Empezar →');
  });

  it('2. Displays the "De la frustración a la diversión" section with problem cards', () => {
    cy.getDataTest('problem-section').should('be.visible');
    cy.getDataTest('problem-title').should('be.visible').and('contain.text', 'De la frustración a la diversión');
    cy.getDataTest('problem-cards-container').should('be.visible');
    cy.getDataTest('problem-card-1').should('be.visible')
      .and('contain.text', '¿Que cocinamos hoy?');
    cy.getDataTest('problem-card-2').should('be.visible')
      .and('contain.text', 'No planifiques. Solo cocina.');
  });

  it('3. Displays the "La solución CookFlow" section with title, description, and recipe cards', () => {
    cy.getDataTest('solution-section').should('be.visible');
    cy.getDataTest('solution-title').should('be.visible').and('contain.text', 'La solución CookFlow');
    cy.getDataTest('solution-description').should('be.visible').and('not.be.empty');
    cy.getDataTest('recipe-cards-grid').should('be.visible');
    cy.getDataTest('main-card-container').should('have.length.at.least', 1);
    cy.getDataTest('register-button-container').should('be.visible');
    cy.getDataTest('register-link')
      .should('be.visible')
      .and('have.attr', 'href', '/login')
      .find('button')
      .should('contain.text', 'A cocinar');
  });

  it('4. Navigates to the login page when "Empezar" button is clicked', () => {
    cy.getDataTest('hero-register-link').click();
    cy.url().should('include', '/login');
  });

  it('5. Navigates to the login page when "A cocinar" button is clicked', () => {
    cy.getDataTest('register-link').click();
    cy.url().should('include', '/login');
  });

  it('6. Navigates to login page when favorite icon on a recipe card is clicked (unregistered user behavior)', () => {
    cy.getDataTest('recipe-cards-grid').should('be.visible');
    cy.getDataTest('recipe-cards-grid').find('[data-testid^="main-card-container"]').first().as('firstRecipeCard');
    cy.get('@firstRecipeCard').find('button[data-testid="custom-button"]').first().as('favoriteButton');
    cy.get('@favoriteButton').click();
    cy.url().should('include', '/login');
  });

  it('7. Navigates to recipe detail page when a recipe card is clicked', () => {
    cy.getDataTest('recipe-cards-grid').find('[data-testid^="main-card-container"]').first().as('firstRecipeCard');
    cy.get('@firstRecipeCard').click();
    cy.url().should('match', /\/recipe\/\d+$/);
  });

  it('8. Displays "Cargando recetas..." when recipes are loading', () => {
    cy.intercept('GET', '/api/recipes/recipes/?ordering=-created_at&limit=32', (req) => {
      req.reply({
        delay: 500,
        fixture: 'recipes/latest_recipes.json'
      });
    }).as('loadingRecipesDelayed');

    cy.visit('/');
    cy.getDataTest('solution-section').contains('Cargando recetas...').should('be.visible');
    cy.wait('@loadingRecipesDelayed');
    cy.getDataTest('solution-section').contains('Cargando recetas...').should('not.exist');
    cy.getDataTest('recipe-cards-grid').find('[data-testid^="recipe-card-"]').should('have.length.at.least', 1);
  });

  it('9. Displays "No hay recetas disponibles." when no recipes are returned', () => {
    cy.intercept('GET', '/api/recipes/recipes/?ordering=-created_at&limit=32', {
      statusCode: 200,
      body: {
        results: [],
        count: 0,
        next: null,
        previous: null,
      }
    }).as('noRecipesReturned');

    cy.visit('/');
    cy.wait('@noRecipesReturned');

    cy.getDataTest('solution-section').contains('No hay recetas disponibles.').should('be.visible');
    cy.getDataTest('recipe-cards-grid').find('[data-testid^="recipe-card-"]').should('not.exist');
  });
});