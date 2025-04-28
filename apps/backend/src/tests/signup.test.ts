import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "..";

describe("signup endpoint", async () => {
  it("should return status 403 for existing username", async () => {
    const res = await request(app).post("/api/v1/signup").send({
      username: "testuser",
      password: "testpassword",
    });
    expect(res.status).toBe(403);
    expect(res.body.message).toBe("User already exists with this username");
  });
  it("should reject invalid username", async () => {
    const res = await request(app).post("/api/v1/signup").send({
      username: "t",
      password: "testpassword",
    });
    expect(res.status).toBe(411);
    expect(res.body.message).toBe("incorrect format");
  });
  it("should reject invalid password", async () => {
    const res = await request(app).post("/api/v1/signup").send({
      username: "testuser",
      password: "short",
    });
    expect(res.status).toBe(411);
    expect(res.body.message).toBe("incorrect format");
  });
});
