import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import { registerRoutes } from "../routes";

const app = express();
app.use(express.json());
registerRoutes(app);

describe("POST /api/create-payment-intent API validation", () => {
  it("should return 400 for missing required fields", async () => {
    const res = await request(app).post("/api/create-payment-intent").send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid payment intent data");
  });

  it("should return 400 for negative amount", async () => {
    const res = await request(app)
      .post("/api/create-payment-intent")
      .send({ amount: -10, items: [], shippingAddress: {} });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid payment intent data");
  });
});
