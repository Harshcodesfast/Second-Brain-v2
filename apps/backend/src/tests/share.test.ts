import request from "supertest";
import { describe, it, expect, test } from "vitest";
import { app } from "..";

describe("share endpoint", async () => {
  let hash: string;
  it("should create a shareable link", async () => {
    const signinRes = await request(app).post("/api/v1/signin").send({
      username: "testuser",
      password: "testpassword",
    });
    const res = await request(app)
      .post("/api/v1/brain/share")
      .set("Authorization", signinRes.body.token)
      .send({
        share: true,
      });
    expect(res.status).toBe(200);
    expect(res.body.hash).toBeDefined();
    hash = res.body.hash;
  });
  it("should get the shareable link", async () => {
    const signinRes = await request(app).post("/api/v1/signin").send({
      username: "testuser",
      password: "testpassword",
    });
    const resCreate = await request(app)
      .post("/api/v1/brain/share")
      .set("Authorization", signinRes.body.token)
      .send({
        share: true,
      });
    expect(resCreate.status).toBe(200);
    expect(resCreate.body.hash).toBeDefined();
    const res = await request(app).get(`/api/v1/brain/${hash}`);
    expect(res.status).toBe(200);
    expect(res.body.username).toBe("testuser");
  });
});
