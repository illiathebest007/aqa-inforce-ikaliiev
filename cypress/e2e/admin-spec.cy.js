/// <reference types="cypress" />

describe('Task-based API Automation Tests', () => {
    let token;
    before(() => {
        cy.loginViaApi().then((authToken) => {
            token = authToken;
        });
    });
    it('Task 1: Create a room and check on the User page via API', () => {
        cy.request({
            method: 'POST',
            url: 'https://automationintesting.online/api/room/',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: {
                roomName: "105",
                type: "Single",
                accessible: false,
                price: 100,
                description: "Please enter a description for this room",
                image: "https://www.mwtestconsultancy.co.uk/img/room1.jpg",
                features: []
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            cy.request('GET', 'https://automationintesting.online/api/room').then((userResponse) => {
                expect(userResponse.status).to.eq(200);
                const targetRoom = userResponse.body.rooms.find(r => r.roomName === "105");
                expect(targetRoom).to.not.be.undefined;
                expect(targetRoom.roomName).to.eq("105");
            });
        });
    });
});