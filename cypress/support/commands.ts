import {
    buildRoom,
    type BookingData,
    type BookingResponse,
    type RoomData,
    type RoomListResponse
} from './factories';

// Rooms created through cy.createRoom() are removed after every test,
// so the shared environment is not polluted even when a test fails.
const createdRoomIds: number[] = [];

afterEach(() => {
    if (!createdRoomIds.length) return;

    cy.loginViaApi().then((token) => {
        createdRoomIds.splice(0).forEach((roomId) => {
            cy.request({
                method: 'DELETE',
                url: `/api/room/${roomId}`,
                headers: { Cookie: `token=${token}` },
                failOnStatusCode: false
            });
        });
    });
});

Cypress.Commands.add('loginViaApi', () => {
    return cy.request<{ token: string }>({
        method: 'POST',
        url: '/api/auth/login',
        body: {
            username: Cypress.env('adminUsername'),
            password: Cypress.env('adminPassword')
        },
        log: false
    }).then((response) => {
        expect(response.status).to.eq(200);
        return response.body.token;
    });
});

// Creates a room with a unique name and yields it as returned by the public room list.
Cypress.Commands.add('createRoom', (overrides: Partial<RoomData> = {}) => {
    const room = buildRoom(overrides);

    return cy.loginViaApi()
        .then((token) => cy.request<{ success: boolean }>({
            method: 'POST',
            url: '/api/room',
            headers: { Cookie: `token=${token}` },
            body: room
        }))
        .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('success', true);
            return cy.request<RoomListResponse>('GET', '/api/room');
        })
        .then((response) => {
            const created = response.body.rooms.find((r) => r.roomName === room.roomName);
            if (!created) {
                throw new Error(`Room "${room.roomName}" was not found in the public room list`);
            }
            createdRoomIds.push(created.roomid);
            return created;
        });
});

Cypress.Commands.add('createBooking', (booking: BookingData) => {
    return cy.request<BookingResponse>('POST', '/api/booking', booking).then((response) => {
        expect(response.status).to.eq(201);
        return response.body;
    });
});
