import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import { registerRoutes } from "../routes";

// Setup Express app for testing
const app = express();
app.use(express.json());
registerRoutes(app);

describe("GET /api/products/:id validation", () => {
  it("should return 400 for invalid id format", async () => {
    const res = await request(app).get("/api/products/abc");
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid product ID");
    expect(res.body.details[0].message).toContain("ID must be a number");
  });

  it("should return 404 for non-existent product", async () => {
    const res = await request(app).get("/api/products/999999");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Product not found");
  });
});
