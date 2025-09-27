import dotenv from "dotenv";
import fs from "fs";

// Load environment variables. If a `.env.test` file exists, prefer it so CI
// runs and local test runs use the committed test config. We load it regardless
// of NODE_ENV because some test scripts set NODE_ENV to a different value
// (for example your `vitest` script currently sets NODE_ENV=development).
const testEnvPath = ".env.test";
if (fs.existsSync(testEnvPath)) {
  dotenv.config({ path: testEnvPath });
} else {
  // Fallback to default behavior (loads `.env` if present)
  dotenv.config();
}

// Polyfill AbortSignal.timeout for Node versions used in the test environment
// Some dependencies (e.g. openid-client) call AbortSignal.timeout which doesn't
// exist on older Node versions that might be used by CI or locally. Add a
// minimal, safe fallback so tests don't crash.
if (typeof (AbortSignal as any)?.timeout !== "function") {
  (AbortSignal as any).timeout = function (ms: number) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), ms);
    // Clear the timeout if someone aborts earlier
    controller.signal.addEventListener("abort", () => clearTimeout(id), {
      once: true,
    });
    return controller.signal;
  };
}
