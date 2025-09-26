import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/__tests__/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
    environment: "jsdom",
  },
  resolve: {
    alias: {
      "@shared": "/shared",
      "@": "/client/src",
    },
  },
});
