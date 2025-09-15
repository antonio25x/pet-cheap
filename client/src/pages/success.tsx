import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/products";
import { CheckCircle, Star, ShoppingBag, Home } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface OrderItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  total: number;
  image?: string;
}

interface OrderData {
  items: OrderItem[];
  total: number;
  paymentIntentId: string;
  timestamp: string;
}

export default function Success() {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Get order data from localStorage
    try {
      const storedOrderData = localStorage.getItem("pet-cheap-last-order");
      if (storedOrderData) {
        const parsedData = JSON.parse(storedOrderData);
        setOrderData(parsedData);
        // Clear the order data from localStorage after reading
        localStorage.removeItem("pet-cheap-last-order");
      } else {
        // If no order data, redirect to home
        toast({
          title: "No order found",
          description: "Redirecting to home page.",
          variant: "destructive",
        });
        setLocation("/");
      }
    } catch (error) {
      console.error("Error reading order data:", error);
      setLocation("/");
    }
  }, [setLocation, toast]);

  const handleFeedbackSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting feedback.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingFeedback(true);

    try {
      await apiRequest("POST", "/api/feedback", {
        rating,
        comment: feedback,
        orderId: orderData?.paymentIntentId || "",
        timestamp: new Date().toISOString(),
      });

      setFeedbackSubmitted(true);
      toast({
        title: "Thank you!",
        description: "Your feedback has been submitted successfully.",
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="loading-success">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-muted/30 min-h-screen" data-testid="success-page">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500" data-testid="success-icon" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-green-700" data-testid="text-success-title">
              Payment Successful!
            </h1>
            <p className="text-xl text-muted-foreground" data-testid="text-success-description">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Receipt */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2" data-testid="text-receipt-title">
                  <ShoppingBag className="h-5 w-5" />
                  <span>Order Receipt</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6" data-testid="receipt-items">
                  {orderData.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b border-border pb-4" data-testid={`receipt-item-${item.id}`}>
                      <div className="flex items-center space-x-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        )}
                        <div>
                          <p className="font-medium" data-testid={`text-receipt-item-name-${item.id}`}>
                            {item.name}
                          </p>
                          <p className="text-sm text-muted-foreground" data-testid={`text-receipt-item-details-${item.id}`}>
                            {formatPrice(parseFloat(item.price))} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium" data-testid={`text-receipt-item-total-${item.id}`}>
                        {formatPrice(item.total)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold">Total Paid:</span>
                    <span className="text-2xl font-bold text-green-600" data-testid="text-receipt-total">
                      {formatPrice(orderData.total)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground" data-testid="text-order-id">
                    Order ID: {orderData.paymentIntentId}
                  </p>
                  <p className="text-sm text-muted-foreground" data-testid="text-order-date">
                    Date: {new Date(orderData.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Feedback Form */}
            <Card>
              <CardHeader>
                <CardTitle data-testid="text-feedback-title">Leave Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                {!feedbackSubmitted ? (
                  <div className="space-y-6">
                    {/* Rating */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">How was your shopping experience?</Label>
                      <div className="flex space-x-2" data-testid="rating-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="transition-colors"
                            data-testid={`star-${star}`}
                          >
                            <Star
                              className={`h-8 w-8 ${
                                star <= rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      {rating > 0 && (
                        <p className="text-sm text-muted-foreground mt-2" data-testid="text-selected-rating">
                          You rated: {rating} star{rating !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>

                    {/* Comment */}
                    <div>
                      <Label htmlFor="feedback-comment" className="text-base font-medium">
                        Additional Comments (Optional)
                      </Label>
                      <Textarea
                        id="feedback-comment"
                        placeholder="Tell us about your experience with our products and service..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="mt-2"
                        rows={4}
                        data-testid="textarea-feedback-comment"
                      />
                    </div>

                    <Button
                      onClick={handleFeedbackSubmit}
                      disabled={isSubmittingFeedback || rating === 0}
                      className="w-full"
                      data-testid="button-submit-feedback"
                    >
                      {isSubmittingFeedback ? "Submitting..." : "Submit Feedback"}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8" data-testid="feedback-submitted">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Thank You!</h3>
                    <p className="text-muted-foreground">
                      Your feedback helps us improve our service for all pet owners.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Continue Shopping */}
          <div className="text-center mt-12">
            <Button
              onClick={() => setLocation("/")}
              variant="outline"
              size="lg"
              className="px-8"
              data-testid="button-continue-shopping"
            >
              <Home className="mr-2 h-5 w-5" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}