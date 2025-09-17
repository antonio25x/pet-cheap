import { describe, it, expect } from "vitest";
import { contactFormSchema } from "../validation";

describe("contactFormSchema", () => {
  it("validates correct contact form data", () => {
    const result = contactFormSchema.safeParse({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      subject: "Hello",
      message: "Test message",
    });
    expect(result.success).toBe(true);
  });

  it("fails for invalid email", () => {
    const result = contactFormSchema.safeParse({
      firstName: "Jane",
      lastName: "Doe",
      email: "not-an-email",
      subject: "Hello",
      message: "Test message",
    });
    expect(result.success).toBe(false);
    expect(result.error!.errors[0].message).toContain("Invalid email");
  });
});
