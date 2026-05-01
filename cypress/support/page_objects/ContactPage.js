class ContactPage {
    visit() {
        cy.visit('/#/contact', { failOnStatusCode: false });
    }
    fillContactForm(contactData) {
        cy.get('[data-testid="ContactName"]').type(contactData.name);
        cy.get('[data-testid="ContactEmail"]').type(contactData.email);
        cy.get('[data-testid="ContactPhone"]').type(contactData.phone);
        cy.get('[data-testid="ContactSubject"]').type(contactData.subject);
        cy.get('[data-testid="ContactDescription"]').type(contactData.message);
    }
    submitForm() {
        cy.contains('button', 'Submit').click();
    }
    verifySuccessMessage() {
        cy.contains('Thanks for getting in touch', { timeout: 10000 }).should('be.visible');
    }
    clickSubmitDirectly() {
        cy.contains('button', 'Submit').click();
    }

    verifyContactValidationErrors() {
        cy.get('.alert-danger', { timeout: 10000 }).should('be.visible')
          .and('contain.text', 'may not be blank');
    }
}
export default new ContactPage();