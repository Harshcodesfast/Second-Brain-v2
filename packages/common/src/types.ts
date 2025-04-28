import { z } from "zod";

export const userProfileSchema = z.object({
  username: z.string().min(2, { message: "Name cannot be empty" }),
  password: z
    .string()
    .min(8, { message: "password should be longer then eight characters" }),
});

export const userContentSchema = z.object({
  link: z.string().url({ message: "link should be a valid url" }),
  type: z.enum(["youtube", "tweeter"]),
  title: z.string().min(2, { message: "Title cannot be empty" }),
});
