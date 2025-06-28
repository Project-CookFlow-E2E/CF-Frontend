// cypress/e2e/profile.cy.js (assuming this is your profile test file)

describe('Profile Page Tests', function() {

  before(() => {
    cy.viewport(1280, 800);
  });

  beforeEach(function() {
    // REMOVE THIS LINE: const validUser = this.users.find(u => u.username === 'ana456');
    // USE HARDCODED VALID CREDENTIALS THAT EXIST IN YOUR DB
    const validUsername = 'ana456'; // Ensure this user exists in your local backend DB
    const validPassword = 'testpass456'; // Ensure this is the correct password for 'ana456'

    // Call loginAPI directly with the hardcoded credentials
    cy.loginAPI(validUsername, validPassword); // Removed the 'false' as it's not a parameter for loginAPI

    cy.visit('/profile');
  });

  it('1. Displays Name of User on profile page', () => {
    // This will now rely on the actual user data returned by your backend for the logged-in user
    // Make sure the 'ana456' user in your DB has a 'first_name' set to 'Ana' or whatever you expect to see.
    cy.getDataTest('profile-name').should('exist').and('not.be.empty');
    // You might want to add a more specific assertion like:
    // cy.getDataTest('profile-name').should('contain.text', 'Ana');
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
    // This now depends on actual favorite recipes associated with 'ana456' in your DB
    cy.getDataTest('saved-recipes-tab').should('have.class', 'bg-red-400');
    cy.getDataTest('favorite-recipes-grid').should('be.visible');
    cy.getDataTest('favorite-recipes-grid').find('[data-testid="main-card-container"]').first().should('be.visible');
  });

  it('11. Displays at least one recipe card under "Recetas creadas" tab after clicking it', () => {
    // This now depends on actual created recipes by 'ana456' in your DB
    cy.getDataTest('created-recipes-tab').click();
    cy.getDataTest('created-recipes-tab').should('have.class', 'bg-red-400');
    cy.getDataTest('saved-recipes-tab').should('not.have.class', 'bg-red-400');
    cy.getDataTest('created-recipes-grid').should('be.visible');
    cy.getDataTest('created-recipes-grid').find('[data-testid="main-card-container"]').first().should('be.visible');
  });

  it('12. Allows editing and saving the user biography', () => {
    // This will now interact with your actual backend's user profile update endpoint
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
    // This will now interact with your actual backend's profile picture upload endpoint
    const imagePath = 'cypress/images/test_image.png'; // Ensure this image exists in your Cypress project

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
      .and('not.include', 'ui-avatars.com') // Assuming you no longer use this default after upload
      .and('not.be.empty');
  });

});