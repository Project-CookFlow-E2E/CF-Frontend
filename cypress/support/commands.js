/**
 * Custom command to get DOM elements by their data-testid attribute.
 * @example cy.getDataTest('hero-title').should('contain.text', 'CookFlow')
 * @param {string} selector - The value of the data-testid attribute.
 * @param {Object} [options] - Optional Cypress command options (e.g., { timeout: 10000 }).
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
Cypress.Commands.add('getDataTest', (selector, options) => {
  return cy.get(`[data-testid="${selector}"]`, options);
});


/**
 * Custom command to perform a UI login.
 * Assumes you are already on the login page or it navigates to it.
 * @example cy.loginUI('username', 'password');
 * @param {string} username - The username for login.
 * @param {string} password - The password for login.
 * @param {boolean} [visitLogin=false] - Whether to call cy.visit('/login') before typing.
 */
Cypress.Commands.add('loginUI', (username, password, visitLogin = false) => {
  if (visitLogin) {
    cy.visit('/login');
  }
  cy.getDataTest('username-input').type(username);
  cy.getDataTest('password-input').type(password);
  cy.getDataTest('custom-button').contains('Iniciar sesión').click();
  cy.url().should('include', '/main');
});


/**
 * Custom command to perform an API login without UI
 * @example cy.loginAPI('username', 'password');
 * @param {string} username - The username for login.
 * @param {string} password - The password for login.
 */
Cypress.Commands.add('loginAPI', (username, password) => {
  cy.session([username, password], () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8000/api/auth/login/',
      body: {
        username: username,
        password: password
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  }, {
    cacheAcrossSpecs: true
  });
});