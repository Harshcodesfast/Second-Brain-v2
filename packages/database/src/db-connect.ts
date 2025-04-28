import { DATABASE_URL } from "./config";
import mongoose from "mongoose";

export const mongoConnect = async function () {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }
  await mongoose.connect(DATABASE_URL);
  console.log("connected");
};
