import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { z } from "zod";
import { productIdSchema } from "../shared/validation";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing required Stripe secret: STRIPE_SECRET_KEY");
}

if (!process.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error("Missing required Stripe public: VITE_STRIPE_PUBLIC_KEY");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

const createPaymentIntentSchema = z.object({
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

const contactFormSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  orderId: z.string(),
  timestamp: z.string(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error fetching products: " + error.message });
    }
  });

  // Get single product
    app.get("/api/products/:id", async (req, res) => {
      // Validate ID param using shared schema
      const result = productIdSchema.safeParse(req.params);
      if (!result.success) {
        return res.status(400).json({
          error: "Invalid product ID",
          details: result.error.errors
        });
      }
      try {
        const product = await storage.getProduct(req.params.id);
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
      } catch (error: any) {
        res
          .status(500)
          .json({ message: "Error fetching product: " + error.message });
      }
    });

  // Create payment intent for Stripe checkout
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, items, shippingAddress } =
        createPaymentIntentSchema.parse(req.body);

      // Validate products and calculate total
      let calculatedTotal = 0;
      for (const item of items) {
        const product = await storage.getProduct(item.id);
        if (!product) {
          return res
            .status(400)
            .json({ message: `Product ${item.id} not found` });
        }
        calculatedTotal += parseFloat(product.price) * item.quantity;
      }

      // Ensure the amount matches our calculation (prevent tampering)
      if (Math.abs(calculatedTotal - amount) > 0.01) {
        return res.status(400).json({ message: "Amount mismatch" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          items: JSON.stringify(items),
          shippingAddress: JSON.stringify(shippingAddress),
        },
      });

      // Create order record
      const order = await storage.createOrder({
        userId: null, // Not implementing user auth for MVP
        total: amount.toString(),
        status: "pending",
        stripePaymentIntentId: paymentIntent.id,
        shippingAddress: JSON.stringify(shippingAddress),
      });

      // Create order items
      for (const item of items) {
        const product = await storage.getProduct(item.id);
        if (product) {
          await storage.createOrderItem({
            orderId: order.id,
            productId: item.id,
            quantity: item.quantity,
            price: product.price,
          });
        }
      }

      res.json({
        clientSecret: paymentIntent.client_secret,
        orderId: order.id,
      });
    } catch (error: any) {
      console.error("Payment intent error:", error);
      res
        .status(500)
        .json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Handle contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = contactFormSchema.parse(req.body);

      // In a real app, you would send an email or save to database
      console.log("Contact form submission:", contactData);

      res.json({ message: "Message sent successfully!" });
    } catch (error: any) {
      res.status(400).json({ message: "Invalid form data: " + error.message });
    }
  });

  // Handle feedback submission
  app.post("/api/feedback", async (req, res) => {
    try {
      const feedbackData = feedbackSchema.parse(req.body);

      // In a real app, you would save feedback to database
      console.log("Feedback submission:", feedbackData);

      res.json({ message: "Feedback received successfully!" });
    } catch (error: any) {
      res.status(400).json({ message: "Invalid feedback data: " + error.message });
    }
  });

  // Stripe webhook handler (for production use)
  app.post("/api/webhook", async (req, res) => {
    const sig = req.headers["stripe-signature"];

    try {
      // In production, verify the webhook signature
      const event = req.body;

      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;

        // Update order status
        const orders = await storage.getProducts(); // This would need to be implemented
        // Find order by stripe payment intent ID and update status
        console.log("Payment succeeded:", paymentIntent.id);
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("Webhook error:", error);
      res.status(400).json({ message: "Webhook error: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
