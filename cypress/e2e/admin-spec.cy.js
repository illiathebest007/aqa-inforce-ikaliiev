/// <reference types="cypress" />

describe('Task-based API Automation Tests', () => {
    let token;
    let createdRoomId;

    beforeEach(() => {
        cy.request({
            method: 'POST',
            url: 'https://automationintesting.online/api/auth/login',
            body: {
                username: "admin",
                password: "password"
            }
        }).then((loginResponse) => {
            token = loginResponse.body.token;
        });
    });

    it('Task 1: Create a room and check on the User page via API', () => {
        cy.request({
            method: 'POST',
            url: 'https://automationintesting.online/api/room',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': `token=${token}`
            },
            body: {
                "roomName": "104",
                "type": "Single",
                "accessible": false,
                "description": "Please enter a description for this room",
                "image": "https://www.mwtestconsultancy.co.uk/img/room1.jpg",
                "roomPrice": "100",
                "features": []
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('success', true);

            cy.request('GET', 'https://automationintesting.online/api/room').then((userResponse) => {
                expect(userResponse.status).to.eq(200);

                const targetRoom = userResponse.body.rooms.find(r => r.roomName === "104");
                expect(targetRoom).to.not.be.undefined;
                expect(targetRoom.roomName).to.eq("104");
        
                createdRoomId = targetRoom.roomid;
                cy.log('Сохраненный ID комнаты: ' + createdRoomId);
            });
        });
    });

    it('Task 2: Book the room using the User page and check on the Admin page', () => {
        cy.request({
            method: 'POST',
            url: 'https://automationintesting.online/api/booking',
            failOnStatusCode: false,
            body: {
                "roomid": createdRoomId,
                "firstname": "John",
                "lastname": "Doe",
                "depositpaid": true,
                "email": "johndoe@example.com",
                "phone": "12345678901",
                "bookingdates": {
                    "checkin": "2026-06-03",
                    "checkout": "2026-06-06"
                }
            }
        }).then((bookingResponse) => {
            expect(bookingResponse.status).to.be.oneOf([201, 200]);

            cy.request({
                method: 'GET',
                url: 'https://automationintesting.online/api/message',
                headers: {
                    'Cookie': `token=${token}`
                }
            }).then((userResponse) => {
                expect(userResponse.status).to.eq(200);
                expect(userResponse.body).to.exist;
            });
        });
    });

    it('Task 3: Edit room menu using API and check changes', () => {
        cy.request({
            method: 'PUT',
            url: `https://automationintesting.online/api/room/${createdRoomId}`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': `token=${token}`
            },
            body: {
                "roomName": "104",
                "type": "Single",
                "accessible": true,
                "description": "Updated description via API",
                "image": "https://www.mwtestconsultancy.co.uk/img/room1.jpg",
                "roomPrice": "150",
                "features": []
            }
        }).then((response) => {
            expect(response.status).to.be.oneOf([200, 202]);

            cy.request('GET', 'https://automationintesting.online/api/room').then((getAfterUpdateResponse) => {
                expect(getAfterUpdateResponse.status).to.eq(200);
                const updatedRoom = getAfterUpdateResponse.body.rooms.find(r => r.roomid === createdRoomId);
                expect(String(updatedRoom.roomPrice)).to.eq("150");
            });
        });
    });
it('Task 4: Delete the room using the Admin page', () => {
        cy.request({
            method: 'DELETE',
            url: `https://automationintesting.online/api/room/${createdRoomId}`,
            headers: {
                'Cookie': `token=${token}`
            }
        }).then((response) => {
            expect(response.status).to.be.oneOf([200, 202]);

            cy.request('GET', 'https://automationintesting.online/api/room').then((userResponse) => {
                expect(userResponse.status).to.eq(200);
            });
        });
    });

});