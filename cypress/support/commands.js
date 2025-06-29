// cypress/support/commands.js

Cypress.Commands.add('getDataTest', (selector, options) => {
  return cy.get(`[data-testid="${selector}"]`, options);
});

Cypress.Commands.add('loginUI', (username, password, visitLoginPage = false) => {
  if (visitLoginPage) {
    cy.visit('/login');
  }
  cy.getDataTest('username-input').type(username);
  cy.getDataTest('password-input').type(password);
  cy.getDataTest('login-button-container')
      .should('be.visible')
      .find('button')
      .contains('Iniciar sesión')
      .should('be.visible')
      .and('not.be.disabled')
      .click();

  cy.url().should('include', '/main');
  cy.get('header').should('contain.text', 'Mi Perfil', { timeout: 10000 });
});

Cypress.Commands.add('loginAPI', (username, password) => {
  cy.session([username, password], () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('API_URL')}/token/`,
      body: {
        username: username,
        password: password
      }
    }).then((response) => { 
      expect(response.status).to.eq(200);
      const token = response.body.access;
      const refreshToken = response.body.refresh;

      cy.window().then((win) => {
        win.localStorage.setItem('cookflow_accessToken', token);
        win.localStorage.setItem('cookflow_refreshToken', refreshToken);
        const event = new win.Event('authchange');
        win.dispatchEvent(event);
      });
    });
  }, {
    cacheAcrossSpecs: true
  });
});

Cypress.Commands.add('setupHomePage', (username, password) => {
  cy.loginAPI(username, password);
  cy.visit('/main');
  cy.get('header').should('be.visible').and('contain.text', 'Mi Perfil', { timeout: 10000 });
  cy.getDataTest('footer-link-search').should('be.visible').and('contain.text', 'Buscar');
  cy.getDataTest('main-title').should('be.visible').and('contain.text', '¿Qué te apetece?');
});

Cypress.Commands.add('logoutUI', () => {
    cy.getDataTest('logout-button')
      .should('be.visible')
      .and('be.enabled')
      .click();
    cy.url().should('include', '/');
    cy.getDataTest('login-title')
      .should('include.text', '¡Bienvenido de nuevo!')
      .and('be.visible');
});