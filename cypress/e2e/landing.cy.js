describe('Landing Page Tests', function() {

  beforeEach(() => {
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
    cy.getDataTest('acocinar-button')
      .should('be.visible')
      .and('contain.text', 'A cocinar');
  });

  it('4. Navigates to the login page when "Empezar" button is clicked', () => {
    cy.getDataTest('hero-register-link').click();
    cy.url().should('include', '/login');
  });

  it('5. Navigates to the login page when "A cocinar" button is clicked', () => {
    cy.getDataTest('acocinar-button').click();
    cy.url().should('include', '/login');
  });
});