import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "../src/hooks/useAuth";

function TestComponent() {
  const { user, isLoading, isAuthenticated, isAdmin, hasRole } = useAuth();
  if (isLoading) return <div>loading</div>;
  return (
    <div>
      <div data-testid="auth">{String(isAuthenticated)}</div>
      <div data-testid="admin">{String(isAdmin)}</div>
      <div data-testid="has-admin">{String(hasRole("admin" as any))}</div>
      <div data-testid="user">{user ? user.email : "no-user"}</div>
    </div>
  );
}

function createClient(fetchImpl?: typeof global.fetch) {
  const queryFn = async ({ queryKey }: any) => {
    const res = await (fetchImpl ?? global.fetch)(queryKey.join("/"), {
      credentials: "include",
    });

    if (res.status === 401) {
      // mimic app behavior where 401 leads to an error (default on401: 'throw')
      throw new Error("401");
    }

    if (!res.ok) throw new Error(String(res.status));

    return res.json();
  };

  return new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity, queryFn } },
  });
}

let originalFetch: typeof global.fetch;

beforeEach(() => {
  originalFetch = global.fetch;
});

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
  cleanup();
});

describe("useAuth hook", () => {
  it("returns user when authenticated", async () => {
    const fetchMock = vi.fn(async () =>
      Promise.resolve(
        new Response(
          JSON.stringify({ email: "jane@example.com", role: "user" }),
          { status: 200 }
        )
      )
    );

    const client = createClient(fetchMock as any);

    render(
      <QueryClientProvider client={client}>
        <TestComponent />
      </QueryClientProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("auth").textContent).toBe("true")
    );
    expect(screen.getByTestId("user").textContent).toBe("jane@example.com");
    expect(screen.getByTestId("admin").textContent).toBe("false");
  });

  it("handles 401 as error (unauthenticated) by default", async () => {
    const fetchMock = vi.fn(async () =>
      Promise.resolve(new Response(null, { status: 401 }))
    );

    const client = createClient(fetchMock as any);

    render(
      <QueryClientProvider client={client}>
        <TestComponent />
      </QueryClientProvider>
    );

    // since the default queryFn in the app throws on 401, the hook's query will error.
    // React Query sets isLoading false and data undefined for errored queries.
    await waitFor(() =>
      expect(screen.getByTestId("auth").textContent).toBe("false")
    );
    expect(screen.getByTestId("user").textContent).toBe("no-user");
  });

  it("returns admin role correctly", async () => {
    const fetchMock = vi.fn(async () =>
      Promise.resolve(
        new Response(
          JSON.stringify({ email: "admin@example.com", role: "admin" }),
          { status: 200 }
        )
      )
    );

    const client = createClient(fetchMock as any);

    render(
      <QueryClientProvider client={client}>
        <TestComponent />
      </QueryClientProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("auth").textContent).toBe("true")
    );
    expect(screen.getByTestId("user").textContent).toBe("admin@example.com");
    expect(screen.getByTestId("admin").textContent).toBe("true");
    expect(screen.getByTestId("has-admin").textContent).toBe("true");
  });
});
