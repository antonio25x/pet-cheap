import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import ProductCard from "@/components/products/product-card";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

export default function Products() {
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery<Product[]>({
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="loading-products">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <section className="py-16 bg-muted/30 min-h-screen" data-testid="products-page">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4" data-testid="text-products-title">Our Products</h1>
          <p className="text-xl text-muted-foreground" data-testid="text-products-description">Carefully selected items for your beloved pets</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto" data-testid="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {products.length === 0 && !isLoading && (
          <div className="text-center py-12" data-testid="no-products-state">
            <h3 className="text-lg font-semibold mb-2">No products available</h3>
            <p className="text-muted-foreground">Please check back later for new items.</p>
          </div>
        )}
      </div>
    </section>
  );
}
