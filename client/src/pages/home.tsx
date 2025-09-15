import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/hooks/use-cart";
import { useLocation } from "wouter";
import { Truck, Shield, Headphones, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [, setLocation] = useLocation();
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const handleAddToCart = (productId: string) => {
    addItem(productId);
    const product = products.find(p => p.id === productId);
    toast({
      title: "Added to cart",
      description: `${product?.name} has been added to your cart.`,
    });
  };

  const scrollToProducts = () => {
    setLocation("/products");
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20" data-testid="hero-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight" data-testid="text-hero-title">
                Quality Pet Supplies at <span className="text-accent">Unbeatable Prices</span>
              </h1>
              <p className="text-xl mb-8 text-white/90 leading-relaxed" data-testid="text-hero-description">
                Everything your furry friends need to stay happy and healthy. From premium food to fun toys, we've got you covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={scrollToProducts}
                  className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 shadow-lg"
                  data-testid="button-shop-now"
                >
                  Shop Now
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setLocation("/about")}
                  className="border-2 border-white text-secondary px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary"
                  data-testid="button-learn-more"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 lg:pl-12">
              <img
                src="https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Happy golden retriever playing with toys"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-muted/50" data-testid="trust-indicators">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center" data-testid="feature-shipping">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
              <p className="text-muted-foreground">On orders over $50</p>
            </div>
            <div className="flex flex-col items-center" data-testid="feature-guarantee">
              <div className="bg-accent/10 p-4 rounded-full mb-4">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Quality Guarantee</h3>
              <p className="text-muted-foreground">30-day return policy</p>
            </div>
            <div className="flex flex-col items-center" data-testid="feature-support">
              <div className="bg-secondary/10 p-4 rounded-full mb-4">
                <Headphones className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Expert Support</h3>
              <p className="text-muted-foreground">Pet care specialists available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16" data-testid="featured-products">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" data-testid="text-featured-title">Featured Products</h2>
            <p className="text-xl text-muted-foreground" data-testid="text-featured-description">Our most popular items loved by pets and their owners</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {products.slice(0, 2).map((product) => (
              <Card key={product.id} className="product-card bg-card border border-border rounded-xl overflow-hidden shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-1" data-testid={`card-featured-product-${product.id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2" data-testid={`text-featured-product-name-${product.id}`}>
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground mb-4" data-testid={`text-featured-product-description-${product.id}`}>
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary" data-testid={`text-featured-product-price-${product.id}`}>
                      {formatPrice(parseFloat(product.price))}
                    </span>
                    <Button
                      onClick={() => handleAddToCart(product.id)}
                      className="btn-primary px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
                      data-testid={`button-add-to-cart-featured-${product.id}`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button
              onClick={scrollToProducts}
              variant="secondary"
              className="px-8 py-3 rounded-lg font-semibold"
              data-testid="button-view-all-products"
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
