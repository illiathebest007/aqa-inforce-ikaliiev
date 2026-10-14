import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://automationintesting.online',
    viewportHeight: 1080,
    viewportWidth: 1920,
    video: false,
    env: {
      adminUsername: 'admin',
      adminPassword: 'password'
    },
  },
});
