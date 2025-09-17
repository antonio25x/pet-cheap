import { describe, it, expect } from "vitest";
import { createPaymentIntentSchema } from "../validation";

describe("createPaymentIntentSchema", () => {
  it("validates correct payment intent data", () => {
    const result = createPaymentIntentSchema.safeParse({
      amount: 100,
      items: [{ id: "1", quantity: 2 }],
      shippingAddress: {
        firstName: "John",
        lastName: "Doe",
        address: "123 St",
        city: "City",
        state: "State",
        zipCode: "12345",
      },
    });
    expect(result.success).toBe(true);
  });

  it("fails for negative amount", () => {
    const result = createPaymentIntentSchema.safeParse({
      amount: -10,
      items: [{ id: "1", quantity: 2 }],
      shippingAddress: {
        firstName: "John",
        lastName: "Doe",
        address: "123 St",
        city: "City",
        state: "State",
        zipCode: "12345",
      },
    });
    expect(result.success).toBe(false);
    expect(result.error!.errors[0].message).toContain(
      "Number must be greater than 0"
    );
  });
});
