import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { CartProvider } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/useAuth";

// Pages
import Home from "@/pages/home";
import Landing from "@/pages/landing";
import Products from "@/pages/products";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Checkout from "@/pages/checkout";
import Success from "@/pages/success";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";

// Layout components
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import CartDrawer from "@/components/cart/cart-drawer";

function Router() {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation onCartOpen={() => setIsCartOpen(true)} />

      <main className="flex-1">
        <Switch>
          {/* Home route - Landing for guests, Home for authenticated users */}
          {isLoading || !isAuthenticated ? (
            <Route path="/" component={Landing} />
          ) : (
            <Route path="/" component={Home} />
          )}
          
          {/* Public routes - available to everyone */}
          <Route path="/products" component={Products} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/success" component={Success} />
          
          {/* Admin-only routes */}
          {isAdmin && <Route path="/dashboard" component={Dashboard} />}
          
          {/* 404 fallback */}
          <Route component={NotFound} />
        </Switch>
      </main>

      <Footer />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
