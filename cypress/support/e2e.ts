// Loaded automatically before every TypeScript spec file.
import './commands';

// The application throws React hydration errors (#418, #423, #425) on page load.
// They are known application issues, so only these are ignored; any other error still fails the test.
const HYDRATION_ERROR = /Minified React error #(418|423|425)/;

Cypress.on('uncaught:exception', (err) => !HYDRATION_ERROR.test(err.message));
