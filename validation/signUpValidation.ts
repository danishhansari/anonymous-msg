import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username atleast should be 2 character")
  .max(20, "Username can't be more than 20 character")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character");

export const signupValidation = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must  be alteast 6 character" }),
});
