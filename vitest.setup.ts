import "dotenv/config";

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
