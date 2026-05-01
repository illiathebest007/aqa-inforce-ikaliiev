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
        //UserPage.checkAvailability();
        UserPage.openBookingForm()
        UserPage.fillBookingForm(dynamicBookingData);
        UserPage.submitBooking();
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
        ContactPage.fillContactForm(validContactData);
        ContactPage.submitForm();
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

    it.only('Case-9: Should open Privacy Policy page', () => {
        UserPage.verifyPrivacyPolicy();
    });
});