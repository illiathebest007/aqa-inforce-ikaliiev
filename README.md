# AQA Inforce Automation Tests

Automated tests for the [Restful Booker Platform](https://automationintesting.online) (Shady Meadows B&B), written with Cypress.

The suite has two parts:

| Spec | Type | What it covers |
|------|------|----------------|
| `cypress/e2e/admin-spec.cy.ts` | API | Room creation, booking visibility for admin, room editing, room deletion |
| `cypress/e2e/user-spec.cy.ts` | UI | Room booking (valid / invalid data, unavailable dates), contact form, header and footer navigation |

Manual test cases for the UI part are described in [tests.txt](tests.txt).

## Test design

- Every test is independent: it creates the rooms and bookings it needs through the API and can be run on its own.
- Rooms get unique names, and booking dates are calculated from the current date, so repeated runs do not conflict.
- Rooms created with `cy.createRoom()` are deleted after each test, even if the test fails.
- Test data factories live in `cypress/support/factories.ts`, API helpers in `cypress/support/commands.ts`, page objects in `cypress/support/page_objects/`.

## Prerequisites

- Node.js 20.1+ in the 20.x line, 22.x, or 24+ (required by Cypress 15)
- npm

## Installation

```bash
git clone https://github.com/illiathebest007/aqa-inforce-ikaliiev.git
cd aqa-inforce-ikaliiev
npm install
```

## Running tests

Interactive mode:

```bash
npm run cy:open
```

Headless mode:

```bash
npm run cy:run      # all specs
npm run test:api    # API spec only
npm run test:ui     # UI spec only
```

Admin credentials are set in `cypress.config.ts` and can be overridden with environment variables:

```bash
CYPRESS_adminUsername=admin CYPRESS_adminPassword=secret npm run cy:run
```

## Known application issues

- **Booked dates are not shown in the calendar (Case-3 is skipped).** The reservation page receives the booked dates from `GET /api/report/room/{id}` with the title `Unavailable`, but the calendar does not render them, so a user can select dates that are already booked. The regression test remains skipped until the application defect is fixed.
- **React hydration errors (#418) on page load.** They are ignored in `cypress/support/e2e.ts`; any other uncaught application error still fails the test.
