import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@shared/schema";
import { formatPrice } from "@/lib/products";
import { ShoppingCart, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const price = parseFloat(product.price);
  const originalPrice = price * 1.33; // Show a "discount" for visual appeal

  return (
    <Card className="product-card bg-card border border-border rounded-xl overflow-hidden shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-1" data-testid={`card-product-${product.id}`}>
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-72 object-cover"
      />
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h3>
          <Badge variant="secondary" className="bg-accent/10 text-accent" data-testid={`badge-product-${product.id}`}>
            {product.id === "premium-dog-food" ? "Best Seller" : "New"}
          </Badge>
        </div>
        <p className="text-muted-foreground mb-4" data-testid={`text-product-description-${product.id}`}>
          {product.description}
        </p>
        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400 mr-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < 4 ? "fill-current" : ""}`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            ({product.id === "premium-dog-food" ? "127" : "89"} reviews)
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
              {formatPrice(price)}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(originalPrice)}
            </span>
          </div>
          <Button
            onClick={() => onAddToCart(product.id)}
            className="btn-primary px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
            data-testid={`button-add-to-cart-${product.id}`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
