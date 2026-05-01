/// <reference types="cypress" />

import UserPage from '../support/page_objects/UserPage';
import ContactPage from '../support/page_objects/ContactPage';

describe('User App Booking Flow', () => {
    beforeEach(() => {
        Cypress.on('uncaught:exception', () => false);
        UserPage.visit();
    });
    it('Case-1: Should book a room with dynamic dates and unique user data', () => {
        const uniqueId = Date.now().toString().slice(-6);
        const dynamicBookingData = {
            firstname: `TestName${uniqueId}`,
            lastname: `TestLastName${uniqueId}`,
            email: `test${uniqueId}@example.com`,
            phone: '12345678901'
        };

        UserPage.openFirstRoomBooking();
        UserPage.openBookingForm();
        UserPage.fillBookingForm(dynamicBookingData);
        cy.intercept('POST', 'https://automationintesting.online/api/booking').as('bookingRequest');

        UserPage.submitBooking();
        cy.wait('@bookingRequest').then((interception) => {
            expect(interception.response.statusCode).to.be.oneOf([201, 200]);
            expect(interception.request.body.firstname).to.eq(dynamicBookingData.firstname);
            expect(interception.request.body.lastname).to.eq(dynamicBookingData.lastname);
        });

        UserPage.verifyBookingConfirmation();
    });

    it('Case-2: Should not book a room with invalid/empty data', () => {
        UserPage.openFirstRoomBooking();
        UserPage.openBookingForm();
        UserPage.clickReserveNowDirectly();
        UserPage.verifyValidationErrors();
    });
    it('Case-3: Check that booked dates are unavailable in the calendar', () => {
        UserPage.openFirstRoomBooking();
        UserPage.verifyUnavailableDates();
    });
    it('Case-4: Should send contact message with valid data', () => {
        const uniqueId = Date.now().toString().slice(-6);
        const validContactData = {
            name: `User${uniqueId}`,
            email: `test${uniqueId}@example.com`,
            phone: '12345678901',
            subject: 'Test Subject Inquiry',
            message: 'Hello, this is a test message to verify the contact form functionality on the website.'
        };

        cy.intercept('POST', 'https://automationintesting.online/api/message').as('messageRequest');

        ContactPage.fillContactForm(validContactData);
        ContactPage.submitForm();

        cy.wait('@messageRequest').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
            expect(interception.request.body.name).to.eq(validContactData.name);
            expect(interception.request.body.subject).to.eq(validContactData.subject);
        });

        ContactPage.verifySuccessMessage();
    });
    it('Case-5: Should not send contact message with empty data', () => {
        ContactPage.clickSubmitDirectly();
        ContactPage.verifyContactValidationErrors();
    });

    it('Case-6: Should navigate via header links correctly', () => {
        UserPage.navigateToHeaderLink('Rooms');
        cy.url().should('include', '/#rooms');
    });

    it('Case-7: Should navigate to Admin panel from header', () => {
        UserPage.verifyAdminPanelNavigation();
    });

    it('Case-8: Should navigate to Admin panel from footer', () => {
        UserPage.verifyAdminFooterNavigation();
    });

    it('Case-9: Should open Privacy Policy page', () => {
        UserPage.verifyPrivacyPolicy();
    });
});