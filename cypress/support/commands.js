// cypress/support/commands.js

Cypress.Commands.add('getDataTest', (selector, options) => {
  return cy.get(`[data-testid="${selector}"]`, options);
});

Cypress.Commands.add('loginUI', (username, password, visitLogin = false) => {
  if (visitLogin) {
    cy.visit('/login');
  }
  cy.getDataTest('username-input').type(username);
  cy.getDataTest('password-input').type(password);
  cy.getDataTest('custom-button').contains('Iniciar sesión').click();
  cy.url().should('include', '/main');
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