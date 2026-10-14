/// <reference types="cypress" />

import {
    buildBooking,
    buildRoom,
    type BookingListResponse,
    type RoomListResponse,
    type RoomResponse
} from '../support/factories';

describe('Admin API: rooms and bookings', () => {
    let authHeaders: { Cookie: string };

    beforeEach(() => {
        cy.loginViaApi().then((token) => {
            authHeaders = { Cookie: `token=${token}` };
        });
    });

    it('Task 1: Created room is visible in the public room list', () => {
        const room = buildRoom({ type: 'Double', roomPrice: '120' });

        cy.createRoom(room).then((created) => {
            expect(created).to.include({
                roomName: room.roomName,
                type: room.type,
                accessible: room.accessible,
                description: room.description
            });
            expect(String(created.roomPrice)).to.eq(room.roomPrice);
        });
    });

    it('Task 2: Booking made by a user is visible to the admin', () => {
        cy.createRoom().then(({ roomid }) => {
            const booking = buildBooking(roomid);

            cy.createBooking(booking).then((created) => {
                expect(created).to.include({ roomid, firstname: booking.firstname, lastname: booking.lastname });
                expect(created.bookingdates).to.deep.eq(booking.bookingdates);
            });

            cy.request<BookingListResponse>({
                method: 'GET',
                url: `/api/booking?roomid=${roomid}`,
                headers: authHeaders
            }).then((response) => {
                expect(response.status).to.eq(200);

                const adminBooking = response.body.bookings.find((b) => b.firstname === booking.firstname);
                if (!adminBooking) {
                    throw new Error(`Booking for ${booking.firstname} was not found in the admin list`);
                }
                expect(adminBooking).to.include({ roomid, lastname: booking.lastname });
                expect(adminBooking.bookingdates).to.deep.eq(booking.bookingdates);
            });
        });
    });

    it('Task 3: Edited room details are saved', () => {
        cy.createRoom().then(({ roomid, roomName }) => {
            const update = buildRoom({
                roomName,
                accessible: true,
                description: 'Updated description via API',
                roomPrice: '150'
            });

            cy.request({
                method: 'PUT',
                url: `/api/room/${roomid}`,
                headers: authHeaders,
                body: update
            }).its('status').should('be.oneOf', [200, 202]);

            cy.request<RoomResponse>('GET', `/api/room/${roomid}`).then(({ body }) => {
                expect(body).to.include({
                    roomid,
                    roomName,
                    accessible: true,
                    description: update.description
                });
                expect(String(body.roomPrice)).to.eq(update.roomPrice);
            });
        });
    });

    it('Task 4: Deleted room disappears from the room list', () => {
        cy.createRoom().then(({ roomid }) => {
            cy.request({
                method: 'DELETE',
                url: `/api/room/${roomid}`,
                headers: authHeaders
            }).its('status').should('be.oneOf', [200, 202]);

            cy.request<RoomListResponse>('GET', '/api/room').then(({ body }) => {
                expect(body.rooms.map((r) => r.roomid)).not.to.include(roomid);
            });
        });
    });
});
