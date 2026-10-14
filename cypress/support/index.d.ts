import type { BookingData, BookingResponse, RoomData, RoomResponse } from './factories';

declare global {
    namespace Cypress {
        interface Chainable {
            loginViaApi(): Chainable<string>;
            createRoom(overrides?: Partial<RoomData>): Chainable<RoomResponse>;
            createBooking(booking: BookingData): Chainable<BookingResponse>;
        }
    }
}

export {};
