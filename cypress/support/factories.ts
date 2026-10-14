export interface BookingDates {
    checkin: string;
    checkout: string;
}

export interface RoomData {
    roomName: string;
    type: string;
    accessible: boolean;
    description: string;
    image: string;
    roomPrice: string;
    features: string[];
}

export interface RoomResponse extends RoomData {
    roomid: number;
}

export interface RoomListResponse {
    rooms: RoomResponse[];
}

export interface GuestData {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
}

export interface BookingData extends GuestData {
    roomid: number;
    depositpaid: boolean;
    bookingdates: BookingDates;
}

export interface BookingResponse extends BookingData {
    bookingid: number;
}

export interface BookingListResponse {
    bookings: BookingResponse[];
}

export interface ContactMessage {
    name: string;
    email: string;
    phone: string;
    subject: string;
    description: string;
}

const uniqueSuffix = (): string => `${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(-9);

const formatDate = (date: Date): string => {
    const pad = (n: number): string => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

// Dates are calculated from today so they never end up in the past.
export const bookingDates = (daysFromToday = 1, nights = 2): BookingDates => {
    const checkin = new Date();
    checkin.setDate(checkin.getDate() + daysFromToday);
    const checkout = new Date(checkin);
    checkout.setDate(checkout.getDate() + nights);

    return { checkin: formatDate(checkin), checkout: formatDate(checkout) };
};

export const buildRoom = (overrides: Partial<RoomData> = {}): RoomData => ({
    roomName: `AQA-${uniqueSuffix()}`,
    type: 'Single',
    accessible: false,
    description: 'Room created by automated tests',
    image: 'https://www.mwtestconsultancy.co.uk/img/room1.jpg',
    roomPrice: '100',
    features: [],
    ...overrides
});

export const buildGuest = (): GuestData => {
    const id = uniqueSuffix();
    return {
        firstname: `Name${id}`,
        lastname: `Lastname${id}`,
        email: `test${id}@example.com`,
        phone: '12345678901'
    };
};

export const buildBooking = (roomid: number, bookingdates = bookingDates()): BookingData => ({
    roomid,
    ...buildGuest(),
    depositpaid: true,
    bookingdates
});

export const buildContactMessage = (): ContactMessage => {
    const id = uniqueSuffix();
    return {
        name: `User${id}`,
        email: `test${id}@example.com`,
        phone: '12345678901',
        subject: 'Test Subject Inquiry',
        description: 'Hello, this is a test message to verify the contact form functionality on the website.'
    };
};
