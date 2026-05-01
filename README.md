<img width="1448" height="985" alt="image" src="https://github.com/user-attachments/assets/5b45b2a2-a553-4602-aa4f-15b044a42272" /><img width="1448" height="985" alt="image" src="https://github.com/user-attachments/assets/b786e475-5dfb-405a-80da-ba90b732d074" /># AQA Inforce Automation Tests

This repository contains automated tests for the Restful Booker Platform, written using the Cypress testing framework. It focuses on validating the backend API functionality, specifically testing room management and booking operations.

The project is designed to ensure the stability and correctness of the application's API endpoints through automated checks. Its primary purposes include:
Regression Testing: Verifying that new changes do not break existing API functionality.
Test Automation: Validating HTTP methods (GET, POST, PUT, DELETE) and responses to ensure data integrity.
Continuous Integration: Enabling automated execution of API tests within a CI/CD pipeline to maintain high software quality.

## Prerequisites
To run the tests on your local machine, you need to have the following installed:
Node.js (version 18.x or higher recommended)
npm (comes bundled with Node.js)

## Installation

Clone the repository:
```bash
git clone https://github.com/illiathebest007/aqa-inforce-ikaliiev.git
```

Navigate to the project directory:
```bash
cd aqa-inforce-ikaliiev
```

Install the required dependencies:

```bash
npm install
```

## Running Tests
You can execute the tests via the interactive Cypress interface or directly in the terminal (headless mode).

Run Tests via Graphical User Interface (GUI):

```bash
npx cypress open
```

In the opened window, select E2E Testing and run admin-spec.cy.js in your browser.

### Run Tests in Console (Headless Mode):

```bash
npx cypress run --spec "cypress/e2e/admin-spec.cy.js"
```

Test Scenario Description
The project implements API tests for the platform functionality:

Task 1: Create a room and check on the User page via API

Sends a POST request to create a room with a unique name.

Verifies the response status code is 200.

Performs a GET request to verify the room exists in the system.

Resolving Git Push Conflicts
If you encounter a conflict while pushing changes to the remote repository, execute the following commands in sequence:

```bash
git pull origin main --rebase
git push -u origin main
```
