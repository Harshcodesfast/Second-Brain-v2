import express from "express";
import Jwt from "jsonwebtoken";
import { z } from "zod";
import { contentModel, linkModel, userModel } from "./db";
import { JWT_PASSWORD } from "./config";
import { userMiddleware } from "./middleware";
import { genRanHex } from "./hashlink";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
  const userProfileSchema = z.object({
    username: z.string().min(1, { message: "Name cannot be empty" }),
    password: z
      .string()
      .min(8, { message: "password should be longer then eight characters" }),
  });
  const parsedData = userProfileSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(411).json({
      message: "incorrect format",
      error: parsedData.error.message,
    });
    return;
  }
  try {
    await userModel.create({
      username: parsedData.data.username,
      password: parsedData.data.password,
    });
    res.json({
      message: "user signed up ",
    });
  } catch (e) {
    res.status(403).json({
      message: "User already exists with this username",
      event: e,
    });
  }
});
app.post("/api/v1/signin", async (req, res) => {
  const userProfileSchema = z.object({
    username: z.string().min(1, { message: "Name cannot be empty" }),
    password: z
      .string()
      .min(8, { message: "password should be longer then eight characters" }),
  });
  const parsedData = userProfileSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(411).json({
      message: "incorrect format",
      error: parsedData.error.message,
    });
    return;
  }

  const username = parsedData.data.username;
  const password = parsedData.data.password;

  const existingUser = await userModel.findOne({
    username,
    password,
  });
  if (existingUser) {
    const token = Jwt.sign({ id: existingUser.id }, JWT_PASSWORD);
    res.json({ token });
  } else {
    res.status(403).json({ message: "incorrect cridentials" });
  }
});
app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const { link, type, title } = req.body;
  await contentModel.create({
    link,
    type,
    title,
    userId: req.userId,
    tags: [],
  });
  res.json({ message: "content recived" });
});
app.get("/api/v1/content", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const content = await contentModel
    .find({
      userId,
    })
    .populate("userId", "username");
  res.json({ content });
});
app.delete("/api/v1/content", userMiddleware, async (req, res) => {
  const contentId = req.body.contentId;
  try {
    await contentModel.deleteMany({
      _id: contentId,
      userId: req.userId,
    });
    res.json({ message: "content Deleted" });
  } catch (e) {
    console.log(e);
  }
});
app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
  const shareable = req.body.share;

  const hash = genRanHex(9);
  if (shareable) {
    const existingLink = await linkModel.findOne({
      userId: req.userId,
    });
    if (existingLink) {
      res.json({ hash: existingLink.hash });
      return;
    }
    await linkModel.create({
      userId: req.userId,
      hash: hash,
    });
    res.json({ hash });
  } else {
    await linkModel.deleteOne({
      userId: req.userId,
    });
    res.json({ message: "removed shareable link " });
  }
});
app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const hash = req.params.shareLink;
  const link = await linkModel.findOne({ hash });
  if (!link) {
    res.status(411).json({
      message: "sorry link expired or does not exist",
    });
    return;
  }
  const content = await contentModel.find({
    userId: link.userId,
  });
  const user = await userModel.findOne({
    _id: link.userId,
  });
  if (!user) {
    res.status(411).json({
      message: "user does not exist",
    });
    return;
  }
  res.json({
    username: user.username,
    content: content,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
