import { type User, type InsertUser, type Product, type Order, type InsertOrder, type OrderItem, type InsertOrderItem } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  updateOrderStatus(id: string, status: string): Promise<void>;
  
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private orders: Map<string, Order>;
  private orderItems: Map<string, OrderItem>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    
    // Initialize with sample products
    this.initializeProducts();
  }

  private initializeProducts() {
    const sampleProducts: Product[] = [
      {
        id: "premium-dog-food",
        name: "Premium Dog Food",
        description: "High-quality nutrition for adult dogs with real chicken as the first ingredient. Supports healthy digestion and shiny coat.",
        price: "29.99",
        image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
        category: "Food",
        inStock: 50,
      },
      {
        id: "cat-toy-set",
        name: "Interactive Cat Toy Set",
        description: "Keep your feline friend entertained for hours with this engaging toy collection. Includes feather wands, balls, and mice.",
        price: "19.99",
        image: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
        category: "Toys",
        inStock: 30,
      }
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      email: insertUser.email || null,
      stripeCustomerId: null, 
      stripeSubscriptionId: null 
    };
    this.users.set(id, user);
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const newOrder: Order = {
      ...order,
      id,
      status: order.status || "pending",
      userId: order.userId || null,
      stripePaymentIntentId: order.stripePaymentIntentId || null,
      createdAt: new Date().toISOString(),
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async updateOrderStatus(id: string, status: string): Promise<void> {
    const order = this.orders.get(id);
    if (order) {
      order.status = status;
      this.orders.set(id, order);
    }
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const id = randomUUID();
    const newOrderItem: OrderItem = { ...orderItem, id };
    this.orderItems.set(id, newOrderItem);
    return newOrderItem;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      (item) => item.orderId === orderId
    );
  }
}

export const storage = new MemStorage();
