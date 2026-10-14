class HomePage {
    visit(): void {
        // The intercept must be registered before the visit, otherwise the request can be missed.
        cy.intercept('GET', '/api/room').as('getRooms');
        cy.visit('/');
        cy.wait('@getRooms');
    }

    clickHeaderLink(linkName: string): void {
        cy.get('.navbar-nav').contains('a', linkName).click();
    }

    clickFooterLink(linkName: string): void {
        cy.get('footer').contains('a', linkName).click();
    }
}

export default new HomePage();
