"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import { Star } from "lucide-react";
import { OrderItem } from "@/hooks/use-orders";
import { toast } from "sonner";

interface OrderRatingModalProps {
  orderNumber: string;
  items: OrderItem[];
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderRatingModal({ orderNumber, items, isOpen, onClose }: OrderRatingModalProps) {
  const [ratings, setRatings] = useState<Record<string, { rating: number; review: string }>>({});
  const [loading, setLoading] = useState(false);

  const handleRatingChange = (itemId: string, rating: number) => {
    setRatings((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], rating },
    }));
  };

  const handleReviewChange = (itemId: string, review: string) => {
    setRatings((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], review },
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Review submitted successfully! Thank you for your feedback.");
    setRatings({});
    setLoading(false);
    onClose();
  };

  const isAllRated = items.every((item) => ratings[item.id.toString()]?.rating > 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rate & Review</DialogTitle>
          <p className="text-sm text-muted-foreground">Order {orderNumber}</p>
        </DialogHeader>

        <div className="space-y-6">
          {items.map((item) => {
            const currentRating = ratings[item.id.toString()]?.rating || 0;
            const currentReview = ratings[item.id.toString()]?.review || "";

            return (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{item.productName}</h4>
                        <p className="text-sm text-muted-foreground">Product ID: {item.productId}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">{item.quantity}x</div>
                    </div>

                    {/* Star Rating */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Product Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} type="button" onClick={() => handleRatingChange(item.id.toString(), star)} className="p-1 hover:scale-110 transition-transform">
                            <Star className={`h-6 w-6 ${star <= currentRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {currentRating === 0 && "Select rating for this product"}
                        {currentRating === 1 && "Very Dissatisfied"}
                        {currentRating === 2 && "Dissatisfied"}
                        {currentRating === 3 && "Neutral"}
                        {currentRating === 4 && "Satisfied"}
                        {currentRating === 5 && "Very Satisfied"}
                      </p>
                    </div>

                    {/* Review Textarea */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Review (Optional)</label>
                      <Textarea placeholder="Share your experience with this product..." value={currentReview} onChange={(e) => handleReviewChange(item.id.toString(), e.target.value)} rows={3} className="resize-none" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Submit Button */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!isAllRated || loading} className="min-w-[100px]">
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
