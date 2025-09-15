import {
  useStripe,
  Elements,
  PaymentElement,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import {
  CartItemWithProduct,
  calculateCartTotal,
  formatPrice,
} from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { useLocation } from "wouter";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error("Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY");
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { items, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Validate shipping address
    if (
      !shippingAddress.firstName ||
      !shippingAddress.lastName ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zipCode
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all shipping address fields.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    setIsProcessing(false);

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      clearCart();
      toast({
        title: "Payment Successful",
        description: "Thank you for your purchase!",
      });
      setLocation("/");
    }
  };

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      data-testid="checkout-form"
    >
      {/* Order Summary */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle data-testid="text-order-summary-title">
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4" data-testid="checkout-items">
              {cartItemsWithProducts.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                  data-testid={`checkout-item-${item.id}`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div>
                      <p
                        className="font-medium text-sm"
                        data-testid={`text-checkout-item-name-${item.id}`}
                      >
                        {item.product.name}
                      </p>
                      <p
                        className="text-xs text-muted-foreground"
                        data-testid={`text-checkout-item-quantity-${item.id}`}
                      >
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span
                    className="font-medium"
                    data-testid={`text-checkout-item-total-${item.id}`}
                  >
                    {formatPrice(item.total)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span
                  className="text-2xl font-bold text-primary"
                  data-testid="text-checkout-total"
                >
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Checkout Form */}
      <div>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          data-testid="form-checkout"
        >
          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-shipping-title">
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shipping-firstName">First Name</Label>
                  <Input
                    id="shipping-firstName"
                    type="text"
                    value={shippingAddress.firstName}
                    onChange={(e) =>
                      handleAddressChange("firstName", e.target.value)
                    }
                    required
                    data-testid="input-shipping-first-name"
                  />
                </div>
                <div>
                  <Label htmlFor="shipping-lastName">Last Name</Label>
                  <Input
                    id="shipping-lastName"
                    type="text"
                    value={shippingAddress.lastName}
                    onChange={(e) =>
                      handleAddressChange("lastName", e.target.value)
                    }
                    required
                    data-testid="input-shipping-last-name"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="shipping-address">Address</Label>
                <Input
                  id="shipping-address"
                  type="text"
                  value={shippingAddress.address}
                  onChange={(e) =>
                    handleAddressChange("address", e.target.value)
                  }
                  required
                  data-testid="input-shipping-address"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="shipping-city">City</Label>
                  <Input
                    id="shipping-city"
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) =>
                      handleAddressChange("city", e.target.value)
                    }
                    required
                    data-testid="input-shipping-city"
                  />
                </div>
                <div>
                  <Label htmlFor="shipping-state">State</Label>
                  <Input
                    id="shipping-state"
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) =>
                      handleAddressChange("state", e.target.value)
                    }
                    required
                    data-testid="input-shipping-state"
                  />
                </div>
                <div>
                  <Label htmlFor="shipping-zip">ZIP Code</Label>
                  <Input
                    id="shipping-zip"
                    type="text"
                    value={shippingAddress.zipCode}
                    onChange={(e) =>
                      handleAddressChange("zipCode", e.target.value)
                    }
                    required
                    data-testid="input-shipping-zip"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-payment-title">
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Lock className="h-4 w-4 text-primary" />
                  <span className="font-medium">
                    Secure Payment with Stripe
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your payment information is encrypted and secure.
                </p>
              </div>

              <div data-testid="stripe-payment-element">
                <PaymentElement />
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full py-4 text-lg font-semibold"
            disabled={!stripe || isProcessing}
            data-testid="button-complete-purchase"
          >
            <Lock className="mr-2 h-5 w-5" />
            {isProcessing ? "Processing..." : "Complete Purchase"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const { items, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before checking out.",
        variant: "destructive",
      });
      setLocation("/products");
      return;
    }
  }, [items.length, setLocation, toast]);

  useEffect(() => {
    if (items.length === 0 || products.length === 0) return;

    // Calculate total and prepare items for payment intent
    const cartItemsWithProducts = items
      .map((item) => {
        const product = products.find((p) => p.id === item.id);
        if (!product) return null;
        return {
          ...item,
          product,
          total: parseFloat(product.price) * item.quantity,
        };
      })
      .filter(Boolean) as CartItemWithProduct[];

    const total = calculateCartTotal(cartItemsWithProducts);

    // Create PaymentIntent as soon as the page loads
    apiRequest("POST", "/api/create-payment-intent", {
      amount: total,
      items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
      shippingAddress: {
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error("Error creating payment intent:", error);
        toast({
          title: "Error",
          description: "Failed to initialize checkout. Please try again.",
          variant: "destructive",
        });
      });
  }, [items, products, toast]);

  if (items.length === 0) {
    return null; // Will redirect in useEffect
  }

  if (!clientSecret) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-testid="loading-checkout"
      >
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p>Preparing checkout...</p>
        </div>
      </div>
    );
  }

  // Make SURE to wrap the form in <Elements> which provides the stripe context.
  return (
    <div className="py-16 bg-muted/30 min-h-screen" data-testid="checkout-page">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1
              className="text-3xl lg:text-4xl font-bold mb-4"
              data-testid="text-checkout-title"
            >
              Checkout
            </h1>
            <p
              className="text-xl text-muted-foreground"
              data-testid="text-checkout-description"
            >
              Review your order and complete your purchase
            </p>
          </div>

          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
          </Elements>
        </div>
      </div>
    </div>
  );
}
