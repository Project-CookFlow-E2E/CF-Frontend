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
  cy.getDataTest('custom-button').contains('Iniciar sesión').click();
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

// Set up the intercept for /users/me/
Cypress.Commands.add('interceptUserMe', (userFixture) => {
  cy.intercept('GET', `${Cypress.env('API_URL')}/users/me/`, {
    statusCode: 200,
    body: {
      id: userFixture.id,
      username: userFixture.username,
      email: userFixture.email,
      first_name: userFixture.first_name || userFixture.username.charAt(0).toUpperCase() + userFixture.username.slice(1, 3),
      last_name: userFixture.last_name || ''
    },
    delay: 50
  }).as('getUserMe');
});

Cypress.Commands.add('setupDashboardPage', (username, password) => {
  const validUser = {
    username: username,
    password: password,
    id: 2,
    email: `${username}@example.com`,
    first_name: 'Ana'
  };
  cy.interceptUserMe(validUser);
  cy.loginAPI(validUser.username, validUser.password);
  cy.visit('/main');
  cy.wait('@getUserMe');
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