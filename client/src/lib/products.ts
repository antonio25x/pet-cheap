import { Product } from "@shared/schema";

export interface CartItem {
  id: string;
  quantity: number;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
  total: number;
}

export const calculateCartTotal = (items: CartItemWithProduct[]): number => {
  return items.reduce((sum, item) => sum + item.total, 0);
};

export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};
