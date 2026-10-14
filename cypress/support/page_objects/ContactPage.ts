import type { ContactMessage } from '../factories';

class ContactPage {
    fillContactForm({ name, email, phone, subject, description }: ContactMessage): void {
        cy.get('[data-testid="ContactName"]').type(name);
        cy.get('[data-testid="ContactEmail"]').type(email);
        cy.get('[data-testid="ContactPhone"]').type(phone);
        cy.get('[data-testid="ContactSubject"]').type(subject);
        cy.get('[data-testid="ContactDescription"]').type(description);
    }

    submitForm(): void {
        cy.contains('button', 'Submit').click();
    }

    verifySuccessMessage(name: string): void {
        cy.contains(`Thanks for getting in touch ${name}!`).should('be.visible');
    }

    validationErrors(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('.alert-danger').should('be.visible');
    }
}

export default new ContactPage();
