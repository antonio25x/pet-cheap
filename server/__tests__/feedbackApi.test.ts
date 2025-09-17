import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import { registerRoutes } from "../routes";

const app = express();
app.use(express.json());
registerRoutes(app);

describe("POST /api/feedback API validation", () => {
  it("should return 200 for valid feedback data", async () => {
    const res = await request(app).post("/api/feedback").send({
      rating: 5,
      orderId: "123",
      timestamp: new Date().toISOString(),
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Feedback received successfully!");
  });

  it("should return 400 for rating out of range", async () => {
    const res = await request(app).post("/api/feedback").send({
      rating: 10,
      orderId: "123",
      timestamp: new Date().toISOString(),
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid feedback data");
  });

  it("should return 400 for missing required fields", async () => {
    const res = await request(app).post("/api/feedback").send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid feedback data");
  });
});
