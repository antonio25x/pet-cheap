import { z } from "zod";

export const productIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number")
});

// Add other API validation schemas here for reusability
