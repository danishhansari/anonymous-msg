import { z } from "zod";

export const signInValidation = z.object({
  username: z.string(),
  password: z.string(),
});
