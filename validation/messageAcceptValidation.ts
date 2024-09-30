import { z } from "zod";

export const messageAcceptValidation = z.object({
  isAcceptingMessage: z.boolean(),
});
