import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:5000",
    specPattern: "e2e/**/*.cy.{js,ts}",
    supportFile: "e2e/support/e2e.ts",
  },
  video: false,
  screenshotOnRunFailure: true,
  defaultCommandTimeout: 10000, // 10 seconds for commands like cy.get, cy.contains
  pageLoadTimeout: 60000, // 60 seconds for page loads
});
