import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const JWT_PASSWORD = process.env.JWT_SECRET || "Hello";
export const DATABASE_URL = process.env.MONGODB_URL;
