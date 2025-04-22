import { z } from "zod";

export const userProfileSchema = z.object({
  username: z.string().min(1, { message: "Name cannot be empty" }),
  password: z
    .string()
    .min(8, { message: "password should be longer then eight characters" }),
});
