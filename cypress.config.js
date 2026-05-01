const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://automationintesting.online',
    viewportHeight: 1080,
    viewportWidth: 1920,
    env: {
      adminUsername: 'admin',
      adminPassword: 'password'
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});