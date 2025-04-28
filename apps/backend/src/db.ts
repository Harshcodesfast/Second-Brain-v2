import mongoose, { model, Schema } from "mongoose";
import { DATABASE_URL } from "./config";

export const mongoConnect = async function () {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }
  await mongoose.connect(DATABASE_URL);
  console.log("connected");
};
(async () => {
  try {
    await mongoConnect();
  } catch (e) {
    console.error(e);
    throw new Error("Failed to connect to the database");
  }
})();
const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

export const userModel = model("user", userSchema);

const contentSchema = new Schema({
  link: String,
  title: String,
  type: String,
  tags: [{ type: mongoose.Types.ObjectId, ref: "tag" }],
  userId: { type: mongoose.Types.ObjectId, ref: "user", require: true },
});

export const contentModel = model("content", contentSchema);

const linkSchema = new Schema({
  hash: String,
  userId: { type: mongoose.Types.ObjectId, ref: "user", require: true },
});
export const linkModel = model("links", linkSchema);
