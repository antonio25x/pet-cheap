import { describe, it, expect } from "vitest";
import { productIdSchema } from "../validation";

describe("productIdSchema", () => {
  it("validates a correct numeric id", () => {
    const result = productIdSchema.safeParse({ id: "123" });
    expect(result.success).toBe(true);
  });

  it("fails for non-numeric id", () => {
    const result = productIdSchema.safeParse({ id: "abc" });
    expect(result.success).toBe(false);
    expect(result.error!.errors[0].message).toContain("ID must be a number");
  });
});
