import { useState, useEffect } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import {
  CartItemWithProduct,
  calculateCartTotal,
  formatPrice,
} from "@/lib/products";
import { useLocation } from "wouter";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem } = useCart();
  const [, setLocation] = useLocation();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const cartItemsWithProducts: CartItemWithProduct[] = items
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) {
        return null;
      }
      return {
        ...item,
        product,
        total: parseFloat(product.price) * item.quantity,
      };
    })
    .filter(Boolean) as CartItemWithProduct[];

  const total = calculateCartTotal(cartItemsWithProducts);

  const handleCheckout = () => {
    onClose();
    setLocation("/checkout");
  };

  const handleContinueShopping = () => {
    onClose();
    setLocation("/products");
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
          data-testid="cart-overlay"
        />
      )}

      {/* Drawer */}
      <div
        className={`cart-drawer fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-background border-l border-border shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        data-testid="cart-drawer"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold" data-testid="text-cart-title">
              Shopping Cart
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full"
              data-testid="button-close-cart"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItemsWithProducts.length === 0 ? (
              <div className="text-center py-12" data-testid="empty-cart-state">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-lg font-semibold mb-2">
                  Your cart is empty
                </h3>
                <p className="text-muted-foreground mb-6">
                  Add some products to get started!
                </p>
                <Button
                  onClick={handleContinueShopping}
                  data-testid="button-continue-shopping"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4" data-testid="cart-items">
                {cartItemsWithProducts.map((item) => (
                  <Card
                    key={item.id}
                    className="bg-card border border-border"
                    data-testid={`cart-item-${item.id}`}
                  >
                    <CardContent className="flex items-center space-x-4 p-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4
                          className="font-medium"
                          data-testid={`text-cart-item-name-${item.id}`}
                        >
                          {item.product.name}
                        </h4>
                        <p
                          className="text-sm text-muted-foreground"
                          data-testid={`text-cart-item-price-${item.id}`}
                        >
                          {formatPrice(parseFloat(item.product.price))} each
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 p-0"
                          data-testid={`button-decrease-quantity-${item.id}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span
                          className="w-8 text-center font-medium"
                          data-testid={`text-cart-item-quantity-${item.id}`}
                        >
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 p-0"
                          data-testid={`button-increase-quantity-${item.id}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive/80 p-2"
                        data-testid={`button-remove-item-${item.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItemsWithProducts.length > 0 && (
            <div
              className="border-t border-border p-6"
              data-testid="cart-footer"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span
                  className="text-2xl font-bold text-primary"
                  data-testid="text-cart-total"
                >
                  {formatPrice(total)}
                </span>
              </div>
              <Button
                onClick={handleCheckout}
                className="w-full mb-3"
                data-testid="button-proceed-to-checkout"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Proceed to Checkout
              </Button>
              <Button
                variant="outline"
                onClick={handleContinueShopping}
                className="w-full"
                data-testid="button-continue-shopping-footer"
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
