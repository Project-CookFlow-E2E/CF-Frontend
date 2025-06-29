// cypress/e2e/profile.cy.js 

describe('Profile Page Tests', function() {

  before(() => {
    cy.viewport(1280, 800);
  });

  beforeEach(function() {
    const validUsername = 'ana456';
    const validPassword = 'testpass456';

    cy.loginAPI(validUsername, validPassword);

    cy.visit('/profile');
  });

  it('1. Displays Name of User on profile page', () => {
    cy.getDataTest('profile-name').should('exist').and('not.be.empty');
  });

  it('2. Displays the profile picture element', () => {
    cy.getDataTest('profile-image').should('be.visible').and('have.attr', 'src');
  });

  it('3. Displays the Edit Profile Image button', () => {
    cy.getDataTest('edit-image-button').should('be.visible');
  });

  it('4. Displays the biography text element', () => {
    cy.getDataTest('biography-text').should('be.visible');
  });

  it('5. Displays the Edit Biography button', () => {
    cy.getDataTest('edit-bio-button').should('be.visible');
  });

  it('6. Displays the "Recetas favoritas" tab', () => {
    cy.getDataTest('saved-recipes-tab').should('be.visible').and('contain.text', 'Recetas favoritas');
  });

  it('7. Displays the "Recetas creadas" tab', () => {
    cy.getDataTest('created-recipes-tab').should('be.visible').and('contain.text', 'Recetas creadas');
  });

  it('8. Verifies the header contains "Mi Perfil"', () => {
    cy.get('header').should('be.visible').and('contain.text', 'Mi Perfil');
  });

  it('9. Verifies the footer search link is visible and correct', () => {
    cy.getDataTest('footer-link-search').should('be.visible').and('contain.text', 'Buscar');
  });

  it.skip('10. Displays at least one recipe card under "Recetas favoritas" tab by default', () => {
    cy.getDataTest('saved-recipes-tab').should('have.class', 'bg-red-400');
    cy.getDataTest('favorite-recipes-grid').should('be.visible');
    cy.getDataTest('favorite-recipes-grid').find('[data-testid="main-card-container"]').first().should('be.visible');
  });

  it.skip('11. Displays at least one recipe card under "Recetas creadas" tab after clicking it', () => {
    cy.getDataTest('created-recipes-tab').click();
    cy.getDataTest('created-recipes-tab').should('have.class', 'bg-red-400');
    cy.getDataTest('saved-recipes-tab').should('not.have.class', 'bg-red-400');
    cy.getDataTest('created-recipes-grid').should('be.visible');
    cy.getDataTest('created-recipes-grid').find('[data-testid="main-card-container"]').first().should('be.visible');
  });

  it('12. Allows editing and saving the user biography', () => {
    const newBiographyText = 'Esta es mi biografía actualizada por Cypress para pruebas.';
    cy.getDataTest('edit-bio-button').should('be.visible').click();
    cy.getDataTest('biography-textarea')
      .should('be.visible')
      .clear()
      .type(newBiographyText);
    cy.getDataTest('save-bio-button').should('be.visible').click();
    cy.getDataTest('biography-text').should('be.visible').and('contain.text', newBiographyText);
    cy.getDataTest('edit-bio-button').should('be.visible');
  });

  it('13. Allows changing the profile picture', () => {
    const imagePath = 'cypress/images/test_image.png';
    cy.getDataTest('edit-image-button').should('be.visible').click();
    cy.getDataTest('close-image-modal-button').should('be.visible');
    cy.get('h3').contains('Editar foto de perfil').should('be.visible');
    cy.getDataTest('image-preview').should('be.visible').and('have.attr', 'src');
    cy.getDataTest('file-input').selectFile(imagePath, { force: true });
    cy.getDataTest('upload-image-button').should('not.be.disabled');
    cy.getDataTest('upload-image-button').click();
    cy.getDataTest('close-image-modal-button').should('not.exist');
    cy.getDataTest('profile-image')
      .should('be.visible')
      .and('have.attr', 'src')
      .and('not.include', 'ui-avatars.com')
      .and('not.be.empty');
  });

});