import {
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

export interface IStorageMock {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(
    id: string,
    productData: Partial<InsertProduct>
  ): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  updateOrderStatus(id: string, status: string): Promise<void>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  initializeProducts(): Promise<void>;
}

export class MockStorage implements IStorageMock {
  private users = new Map<string, User>();
  private products = new Map<string, Product>();
  private orders = new Map<string, Order>();
  private orderItems = new Map<string, OrderItem[]>();

  constructor() {
    // Initialize sample products
    const sample: InsertProduct[] = [
      {
        id: "premium-dog-food",
        name: "Premium Dog Food",
        description: "High-quality nutrition for adult dogs.",
        price: "29.99",
        image: "",
        category: "Food",
        inStock: 50,
      },
      {
        id: "cat-toy-set",
        name: "Interactive Cat Toy Set",
        description: "Fun toys for cats.",
        price: "19.99",
        image: "",
        category: "Toys",
        inStock: 30,
      },
    ];
    for (const p of sample) {
      const product = { ...p, inStock: p.inStock ?? 0 } as Product;
      this.products.set(p.id, product);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const id = userData.id || `user-${Date.now()}`;
    const user: User = { ...userData, id } as any;
    this.users.set(user.id, user);
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    this.products.set(product.id, product as Product);
    return product as Product;
  }

  async updateProduct(
    id: string,
    productData: Partial<InsertProduct>
  ): Promise<Product> {
    const existing = this.products.get(id);
    if (!existing) throw new Error("Product not found");
    const updated = { ...existing, ...productData } as Product;
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<void> {
    this.products.delete(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    // InsertOrder likely doesn't include 'id', so generate one here.
    const id = (order as any).id ?? `order-${Date.now()}`;
    const newOrder: Order = { ...(order as any), id } as Order;
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async updateOrderStatus(id: string, status: string): Promise<void> {
    const o = this.orders.get(id);
    if (o) {
      (o as any).status = status;
      this.orders.set(id, o);
    }
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const list = this.orderItems.get(orderItem.orderId) ?? [];
    const item: OrderItem = { ...orderItem } as any;
    list.push(item);
    this.orderItems.set(orderItem.orderId, list);
    return item;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return this.orderItems.get(orderId) ?? [];
  }

  // no-op for mock
  async initializeProducts(): Promise<void> {
    return;
  }
}

export default MockStorage;
