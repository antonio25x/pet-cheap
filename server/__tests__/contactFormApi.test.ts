import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import { registerRoutes } from "../routes";

const app = express();
app.use(express.json());
registerRoutes(app);

describe("POST /api/contact API validation", () => {
  it("should return 200 for valid contact form data", async () => {
    const res = await request(app).post("/api/contact").send({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      subject: "Test",
      message: "Hello",
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Message sent successfully!");
  });

  it("should return 400 for invalid email", async () => {
    const res = await request(app).post("/api/contact").send({
      firstName: "John",
      lastName: "Doe",
      email: "not-an-email",
      subject: "Test",
      message: "Hello",
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid contact form data");
  });

  it("should return 400 for missing required fields", async () => {
    const res = await request(app).post("/api/contact").send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid contact form data");
  });
});
