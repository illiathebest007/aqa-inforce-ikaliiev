/// <reference types="cypress" />

import HomePage from '../support/page_objects/HomePage';
import ReservationPage from '../support/page_objects/ReservationPage';
import ContactPage from '../support/page_objects/ContactPage';
import { bookingDates, buildBooking, buildContactMessage, buildGuest } from '../support/factories';

describe('User App: room booking', () => {
    let roomId: number | undefined;

    const getRoomId = (): number => {
        if (roomId === undefined) {
            throw new Error('Room setup did not complete');
        }
        return roomId;
    };

    beforeEach(() => {
        cy.createRoom().then((room) => {
            roomId = room.roomid;
        });
    });

    it('Case-1: Should book a room with valid data', () => {
        const dates = bookingDates(3, 2);
        const guest = buildGuest();

        ReservationPage.visit(getRoomId(), dates);
        ReservationPage.openBookingForm();
        ReservationPage.fillBookingForm(guest);

        cy.intercept('POST', '/api/booking').as('bookingRequest');
        ReservationPage.submitBooking();

        cy.wait('@bookingRequest').then(({ request, response }) => {
            expect(response?.statusCode).to.eq(201);
            expect(request.body).to.include({
                roomid: getRoomId(),
                firstname: guest.firstname,
                lastname: guest.lastname,
                email: guest.email
            });
            expect(request.body.bookingdates).to.deep.eq(dates);
        });

        ReservationPage.verifyBookingConfirmed(dates);
    });

    it('Case-2: Should not book a room with empty or invalid data', () => {
        cy.intercept('POST', '/api/booking').as('bookingRequest');

        ReservationPage.visit(getRoomId(), bookingDates(3, 2));
        ReservationPage.openBookingForm();
        ReservationPage.submitBooking();

        cy.wait('@bookingRequest').its('response.statusCode').should('eq', 400);
        ReservationPage.validationErrors()
            .should('contain.text', 'Firstname should not be blank')
            .and('contain.text', 'Lastname should not be blank');

        ReservationPage.fillBookingForm({ ...buildGuest(), email: 'test.com' });
        ReservationPage.submitBooking();

        cy.wait('@bookingRequest').its('response.statusCode').should('eq', 400);
        ReservationPage.validationErrors().should('contain.text', 'must be a well-formed email address');
        cy.contains('Booking Confirmed').should('not.exist');
    });

    it.skip('Case-3: Earlier booked dates are shown as Unavailable in the calendar (known application bug)', () => {
        const bookedDates = bookingDates(3, 2);
        cy.createBooking(buildBooking(getRoomId(), bookedDates));

        ReservationPage.visit(getRoomId(), bookedDates);
        cy.get('@roomReport').its('response.body.report').should('deep.include', {
            start: bookedDates.checkin,
            end: bookedDates.checkout,
            title: 'Unavailable'
        });

        ReservationPage.showMonthOf(bookedDates.checkin);
        ReservationPage.calendarEvents('Unavailable').should('be.visible');
    });
});

describe('User App: contact form and navigation', () => {
    beforeEach(() => {
        HomePage.visit();
    });

    it('Case-4: Should send contact message with valid data', () => {
        const message = buildContactMessage();
        cy.intercept('POST', '/api/message').as('messageRequest');

        ContactPage.fillContactForm(message);
        ContactPage.submitForm();

        cy.wait('@messageRequest').then(({ request, response }) => {
            expect(response?.statusCode).to.eq(200);
            expect(request.body).to.include(message);
        });
        ContactPage.verifySuccessMessage(message.name);
    });

    it('Case-5: Should not send contact message with empty data', () => {
        ContactPage.submitForm();

        ContactPage.validationErrors()
            .should('contain.text', 'Name may not be blank')
            .and('contain.text', 'Email may not be blank')
            .and('contain.text', 'Message may not be blank');
    });

    it('Case-6: Should navigate to the Rooms section from header', () => {
        HomePage.clickHeaderLink('Rooms');
        cy.location('hash').should('eq', '#rooms');
        cy.get('#rooms').should('be.visible');
    });

    it('Case-7: Should navigate to Admin panel from header', () => {
        HomePage.clickHeaderLink('Admin');
        cy.location('pathname').should('eq', '/admin');
    });

    it('Case-8: Should navigate to Admin panel from footer', () => {
        HomePage.clickFooterLink('Admin panel');
        cy.location('pathname').should('eq', '/admin');
    });

    it('Case-9: Should open Privacy Policy page from footer', () => {
        HomePage.clickFooterLink('Privacy-Policy');
        cy.location('pathname').should('eq', '/privacy');
    });
});
