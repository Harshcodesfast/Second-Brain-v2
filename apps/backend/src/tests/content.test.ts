import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "..";

describe("content post endpoint", async () => {
  it("should accept valid content", async () => {
    const signinRes = await request(app).post("/api/v1/signin").send({
      username: "testuser",
      password: "testpassword",
    });
    const res = await request(app)
      .post("/api/v1/content")
      .set("Authorization", signinRes.body.token)
      .send({
        link: "https://example.com",
        type: "youtube",
        title: "Example Article 1",
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("content recived");
  });
  it("should reject invalid content case 1", async () => {
    const signinRes = await request(app).post("/api/v1/signin").send({
      username: "testuser",
      password: "testpassword",
    });
    const res = await request(app)
      .post("/api/v1/content")
      .set("Authorization", signinRes.body.token)
      .send({
        link: "https://example.com",
        type: "invalid_type",
        title: "Example Article",
      });
    expect(res.status).toBe(411);
    expect(res.body.message).toBe("incorrect format");
  });
  it("should reject invalid content case 2", async () => {
    const signinRes = await request(app).post("/api/v1/signin").send({
      username: "testuser",
      password: "testpassword",
    });
    const res = await request(app)
      .post("/api/v1/content")
      .set("Authorization", signinRes.body.token)
      .send({
        link: "www.example.com",
        type: "youtube",
        title: "Example Article",
      });
    expect(res.status).toBe(411);
    expect(res.body.message).toBe("incorrect format");
  });
  it("should reject invalid content case 3", async () => {
    const signinRes = await request(app).post("/api/v1/signin").send({
      username: "testuser",
      password: "testpassword",
    });
    const res = await request(app)
      .post("/api/v1/content")
      .set("Authorization", signinRes.body.token)
      .send({
        link: "https://example.com",
        type: "youtube",
        title: "E",
      });
    expect(res.status).toBe(411);
    expect(res.body.message).toBe("incorrect format");
  });
});
describe("content get endpoint", async () => {
  it("should return content", async () => {
    const signinRes = await request(app).post("/api/v1/signin").send({
      username: "testuser",
      password: "testpassword",
    });

    const res = await request(app)
      .get("/api/v1/content")
      .set("Authorization", signinRes.body.token);
    expect(res.status).toBe(200);
    expect(res.body.content).toBeDefined();
  });
});
describe("content delete endpoint", async () => {
  it("should delete content", async () => {
    const signinRes = await request(app).post("/api/v1/signin").send({
      username: "testuser",
      password: "testpassword",
    });
    const resGet = await request(app)
      .get("/api/v1/content")
      .set("Authorization", signinRes.body.token);
    expect(resGet.status).toBe(200);
    expect(resGet.body.content).toBeDefined();

    const res = await request(app)
      .delete("/api/v1/content")
      .set("Authorization", signinRes.body.token)
      .send({
        contentId: resGet.body.content[0]._id,
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("content Deleted");
  });
});
