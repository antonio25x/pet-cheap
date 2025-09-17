import { describe, it, expect } from "vitest";
import { feedbackSchema } from "../validation";

describe("feedbackSchema", () => {
  it("validates correct feedback data", () => {
    const result = feedbackSchema.safeParse({
      rating: 5,
      orderId: "order123",
      timestamp: new Date().toISOString(),
    });
    expect(result.success).toBe(true);
  });

  it("fails for rating out of range", () => {
    const result = feedbackSchema.safeParse({
      rating: 10,
      orderId: "order123",
      timestamp: new Date().toISOString(),
    });
    expect(result.success).toBe(false);
    expect(result.error!.errors[0].message).toContain(
      "Number must be less than or equal to 5"
    );
  });
});
