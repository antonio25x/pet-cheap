import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:5000",
    specPattern: "e2e/**/*.cy.{js,ts}",
    supportFile: "e2e/support/e2e.ts",
  },
  video: false,
  screenshotOnRunFailure: true,
});
