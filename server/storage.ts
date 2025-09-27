import {
  users,
  products,
  orders,
  orderItems,
  type User,
  type InsertUser,
  type UpsertUser,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
} from "@shared/schema";
import { eq } from "drizzle-orm";
import MockStorage from "./mockStorage";

export interface IStorage {
  // User operations - Required for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Product operations - Public access
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;

  // Product management operations - Admin only
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;

  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  updateOrderStatus(id: string, status: string): Promise<void>;

  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
}

// Database implementation using PostgreSQL
async function getDb() {
  // dynamic import so tests that use MockStorage don't load server/db (which
  // requires a real DATABASE_URL)
  const mod = await import("./db");
  return mod.db;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const db = await getDb();
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const db = await getDb();
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getProducts(): Promise<Product[]> {
    const db = await getDb();
    return await db.select().from(products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const db = await getDb();
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));
    return product || undefined;
  }

  // Product management operations - Admin only
  async createProduct(product: InsertProduct): Promise<Product> {
    const db = await getDb();
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(
    id: string,
    productData: Partial<InsertProduct>
  ): Promise<Product> {
    const db = await getDb();
    const [updatedProduct] = await db
      .update(products)
      .set(productData)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    const db = await getDb();
    await db.delete(products).where(eq(products.id, id));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const db = await getDb();
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const db = await getDb();
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async updateOrderStatus(id: string, status: string): Promise<void> {
    const db = await getDb();
    await db.update(orders).set({ status }).where(eq(orders.id, id));
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const db = await getDb();
    const [newOrderItem] = await db
      .insert(orderItems)
      .values(orderItem)
      .returning();
    return newOrderItem;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    const db = await getDb();
    return await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));
  }

  // Initialize with sample products if needed
  async initializeProducts(): Promise<void> {
    const existingProducts = await this.getProducts();
    if (existingProducts.length > 0) {
      return; // Products already exist
    }

    const sampleProducts: InsertProduct[] = [
      {
        id: "premium-dog-food",
        name: "Premium Dog Food",
        description:
          "High-quality nutrition for adult dogs with real chicken as the first ingredient. Supports healthy digestion and shiny coat.",
        price: "29.99",
        image:
          "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
        category: "Food",
        inStock: 50,
      },
      {
        id: "cat-toy-set",
        name: "Interactive Cat Toy Set",
        description:
          "Keep your feline friend entertained for hours with this engaging toy collection. Includes feather wands, balls, and mice.",
        price: "19.99",
        image:
          "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
        category: "Toys",
        inStock: 30,
      },
    ];

    const db = await getDb();
    for (const product of sampleProducts) {
      await db.insert(products).values(product).onConflictDoNothing();
    }
  }
}

// MockStorage is implemented in server/mockStorage.ts

// Export the appropriate storage implementation for the environment. Use the
// mock storage in tests to avoid requiring a real DATABASE_URL.
let storageImpl: IStorage;
if (process.env.NODE_ENV === "test") {
  storageImpl = new MockStorage();
} else {
  const databaseStorage = new DatabaseStorage();
  // initialize products (fire-and-forget)
  databaseStorage.initializeProducts().catch((e) => console.error(e));
  storageImpl = databaseStorage;
}

export const storage = storageImpl;
