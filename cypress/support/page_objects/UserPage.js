class UserPage {
    visit() {
        cy.visit('/', { failOnStatusCode: false });
        cy.intercept('GET', '/api/room').as('getRooms');
        cy.wait('@getRooms');
    }
    checkAvailability() {
        cy.contains('Check Availability').should('be.visible').click();
    }

    openFirstRoomBooking() {
        cy.contains('Book now', { timeout: 15000 }).should('be.visible').first().click();
    }

    openBookingForm() {
        cy.contains('Reserve Now', { timeout: 10000 }).should('be.visible').click();
    }

    fillBookingForm(bookingData) {
        cy.get('.room-firstname').type(bookingData.firstname);
        cy.get('.room-lastname').type(bookingData.lastname);
        cy.get('.room-email').type(bookingData.email);
        cy.get('.room-phone').type(bookingData.phone);
    }
    submitBooking() {
        cy.contains('Reserve Now', { timeout: 10000 }).should('be.visible').click();
    }

    verifyBookingConfirmation() {
        cy.get('.modal-content, .row', { timeout: 15000 }).should('be.visible');
        cy.get('body').should('contain.text', 'Booking').and('contain.text', 'Confirmed');
    }

    clickReserveNowDirectly() {
        cy.get('button.btn-primary').contains('Reserve Now').click();
    }

    verifyValidationErrors() {
        cy.get('.alert-danger', { timeout: 10000 }).should('be.visible')
            .and('contain.text', 'should not be blank');
    }
    verifyUnavailableDates() {
        cy.get('.rbc-off-range', { timeout: 10000 })
            .should('exist');
    }

    navigateToHeaderLink(linkName) {
        cy.get('.navbar-nav').contains(linkName).click();
    }

    verifyAdminPanelNavigation() {
        cy.get('.navbar-nav').contains('Admin').click();
        cy.url().should('include', '/admin');
    }
    verifyAdminFooterNavigation() {
        cy.get('footer').contains('Admin panel').click();
        cy.url().should('include', '/admin');
    }
    verifyPrivacyPolicy() {
        cy.get('footer a[href="/privacy"]').click();
        cy.url().should('include', '/privacy');
    }
}

export default new UserPage();