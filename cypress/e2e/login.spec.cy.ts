import USERS from "../fixtures/users.ts";

describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('/login');
    });
  
    it('should display the login page', () => {
      cy.get('.container.page').should('exist');
      cy.get('h1').should('contain.text', 'AIT Collab');
      cy.get('form').should('exist');
      cy.get('label').should('contain.text', 'Username');
      cy.get('label').should('contain.text', 'Password');
      cy.get('button').should('contain.text', 'Login');
      cy.get('a').should('contain.text', 'Do not have an account? Sign up here!');
    });
  
    it('should display an error message for invalid credentials', () => {
      cy.get("[data-cy=username]").type(USERS.invalid.username);
      cy.get("[data-cy=password]").type(USERS.invalid.password);
      cy.get('form').submit();
  
      cy.get('.text-danger').should('contain.text', 'Invalid Credentials');
    });
  
    it('should redirect to the registration page', () => {
      cy.get('#register').click();
  
      cy.url().should('include', '/register');
    });
  });
  