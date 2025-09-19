import { z } from "zod";

export const productIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number"),
});

// Add other API validation schemas here for reusability

export const createPaymentIntentSchema = z.object({
  amount: z.number().positive(),
  items: z.array(
    z.object({
      id: z.string(),
      quantity: z.number().positive(),
    })
  ),
  shippingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
  }),
});

export const contactFormSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

export const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  orderId: z.string(),
  timestamp: z.string(),
});

// Product management validation schemas
export const createProductSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid decimal"),
  image: z.string().url(),
  category: z.string().min(1),
  inStock: z.number().int().min(0),
});

export const updateProductSchema = createProductSchema.partial().omit({ id: true });
