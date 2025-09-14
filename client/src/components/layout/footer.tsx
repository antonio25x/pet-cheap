import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log("Newsletter subscription submitted");
  };

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🐾</span>
              <span className="text-xl font-bold text-primary">Pet Cheap</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Quality pet supplies at unbeatable prices. Your pets deserve the best!
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" asChild data-testid="link-facebook">
                <a href="#" aria-label="Facebook">
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild data-testid="link-twitter">
                <a href="#" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild data-testid="link-instagram">
                <a href="#" aria-label="Instagram">
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild data-testid="link-youtube">
                <a href="#" aria-label="YouTube">
                  <Youtube className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors duration-200" data-testid="link-footer-home">Home</Link></li>
              <li><Link href="/products" className="text-muted-foreground hover:text-primary transition-colors duration-200" data-testid="link-footer-products">Products</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors duration-200" data-testid="link-footer-about">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors duration-200" data-testid="link-footer-contact">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200" data-testid="link-faq">FAQ</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200" data-testid="link-shipping">Shipping Info</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200" data-testid="link-returns">Returns</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200" data-testid="link-privacy">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-muted-foreground mb-4">Get the latest deals and pet care tips!</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2" data-testid="form-newsletter">
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full"
                data-testid="input-newsletter-email"
                required
              />
              <Button type="submit" className="w-full" data-testid="button-newsletter-submit">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">&copy; 2024 Pet Cheap. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
