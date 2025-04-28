import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "..";

describe("signin endpoint", async () => {
  it("should return jwt", async () => {
    const res = await request(app).post("/api/v1/signin").send({
      username: "testuser",
      password: "testpassword",
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTypeOf("string");
  });
  it("should reject invalid username", async () => {
    const res = await request(app).post("/api/v1/signin").send({
      username: "t",
      password: "testpassword",
    });
    expect(res.status).toBe(411);
    expect(res.body.message).toBe("incorrect format");
  });
  it("should reject invalid password", async () => {
    const res = await request(app).post("/api/v1/signin").send({
      username: "testuser",
      password: "short",
    });
    expect(res.status).toBe(411);
    expect(res.body.message).toBe("incorrect format");
  });
  it("should return status 403 for incorrect credentials", async () => {
    const res = await request(app).post("/api/v1/signin").send({
      username: "testuser",
      password: "wrongpassword",
    });
    expect(res.status).toBe(403);
    expect(res.body.message).toBe("incorrect credentials");
  });
});
