import type { BookingDates, GuestData } from '../factories';

const monthLabel = (isoDate: string): string => {
    const [year, month] = isoDate.split('-').map(Number);
    return new Date(year, month - 1, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
};

class ReservationPage {
    visit(roomId: number, { checkin, checkout }: BookingDates): void {
        cy.intercept('GET', `/api/report/room/${roomId}`).as('roomReport');
        cy.visit(`/reservation/${roomId}?checkin=${checkin}&checkout=${checkout}`);
        cy.wait('@roomReport');
    }

    openBookingForm(): void {
        cy.get('#doReservation').should('be.visible').click();
    }

    fillBookingForm({ firstname, lastname, email, phone }: GuestData): void {
        cy.get('.room-firstname').clear().type(firstname);
        cy.get('.room-lastname').clear().type(lastname);
        cy.get('.room-email').clear().type(email);
        cy.get('.room-phone').clear().type(phone);
    }

    submitBooking(): void {
        cy.contains('button.btn-primary', 'Reserve Now').click();
    }

    validationErrors(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('.alert-danger').should('be.visible');
    }

    verifyBookingConfirmed({ checkin, checkout }: BookingDates): void {
        cy.contains('Booking Confirmed').should('be.visible');
        cy.contains(`${checkin} - ${checkout}`).should('be.visible');
    }

    // The calendar opens on the current month; switch to the month of the given date.
    showMonthOf(isoDate: string): void {
        const expected = monthLabel(isoDate);
        cy.get('.rbc-toolbar-label').then(($label) => {
            if ($label.text() !== expected) {
                cy.get('.rbc-toolbar').contains('button', 'Next').click();
            }
        });
        cy.get('.rbc-toolbar-label').should('have.text', expected);
    }

    calendarEvents(title: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`.rbc-event-content[title="${title}"]`);
    }
}

export default new ReservationPage();
