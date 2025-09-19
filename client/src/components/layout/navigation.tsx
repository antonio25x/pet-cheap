import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ShoppingCart, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/useAuth";
import type { LucideIcon } from "lucide-react";

interface NavigationProps {
  onCartOpen: () => void;
}

interface NavigationItem {
  name: string;
  href: string;
  icon?: LucideIcon;
}

export default function Navigation({ onCartOpen }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { getTotalItems } = useCart();
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth();

  const navigation: NavigationItem[] = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];
  
  // Add dashboard for admin users
  const adminNavigation: NavigationItem[] = isAdmin 
    ? [{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }]
    : [];
  
  const allNavigation = [...navigation, ...adminNavigation];

  const totalItems = getTotalItems();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2"
            data-testid="link-home"
          >
            <span className="text-2xl">🐾</span>
            <span className="text-xl font-bold text-primary">Pet Cheap</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {allNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-foreground hover:text-primary transition-colors duration-200 font-medium flex items-center gap-1 ${
                  location === item.href ? "text-primary" : ""
                }`}
                data-testid={`link-${item.name.toLowerCase()}`}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth, Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {!isLoading && (
              isAuthenticated ? (
                <>
                  <span className="hidden sm:inline text-sm text-foreground">
                    Welcome, {user?.firstName || user?.email}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.href = "/api/logout"}
                    className="p-2"
                    data-testid="button-logout"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline ml-2">Sign Out</span>
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="button-login"
                >
                  Sign In
                </Button>
              )
            )}
            
            {/* Cart available for all users */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onCartOpen}
              className="relative p-2"
              data-testid="button-cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {allNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-foreground hover:text-primary transition-colors duration-200 font-medium ${
                    location === item.href ? "text-primary" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid={`link-mobile-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
