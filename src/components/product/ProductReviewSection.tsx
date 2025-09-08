import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, DollarSign } from "lucide-react";
import ProductReviewStats from "./ProductReviewStats";
import { useAuth } from "@/hooks/use-auth";

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
  readOnly?: boolean;
}

function StarRating({ rating, setRating, readOnly = false }: StarRatingProps) {
  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`w-8 h-8 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 focus:ring-offset-gray-900 ${
            star <= rating ? "text-yellow-400 bg-gray-800 hover:bg-gray-700" : "text-gray-500 bg-gray-800 hover:bg-gray-700"
          } ${!readOnly ? "cursor-pointer" : "cursor-default"}`}
          onClick={() => !readOnly && setRating(star)}
          disabled={readOnly}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <span className="text-lg">★</span>
        </button>
      ))}
    </div>
  );
}

interface EligibleOrder {
  id: number;
  orderNumber: string;
  createdAt: string;
  totalAmount: number;
  productInfo: {
    id: number;
    productName: string;
    productImage: string | null;
    quantity: number;
  };
}

interface ReviewFormProps {
  productId: number;
  onSubmitted: () => void;
}

function ReviewForm({ productId, onSubmitted }: ReviewFormProps) {
  const { user, loading: authLoading } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [eligibleOrders, setEligibleOrders] = useState<EligibleOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState("");

  const fetchEligibleOrders = useCallback(async () => {
    if (!user) return;
    
    setLoadingOrders(true);
    try {
      const response = await fetch(`/api/review/eligible-orders?productId=${productId}`);
      
      if (response.ok) {
        const orders = await response.json();
        setEligibleOrders(orders);
      } else {
        setEligibleOrders([]);
      }
    } catch (error) {
      console.error("Error fetching eligible orders:", error);
      setEligibleOrders([]);
    }
    setLoadingOrders(false);
  }, [productId, user]);

  useEffect(() => {
    fetchEligibleOrders();
  }, [fetchEligibleOrders]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (rating < 1) {
      setError("Please select a rating.");
      setLoading(false);
      return;
    }

    if (comment.length < 5) {
      setError("Comment must be at least 5 characters.");
      setLoading(false);
      return;
    }

    if (!selectedOrderId) {
      setError("Please select an order to review.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/review?productId=${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          rating, 
          comment,
          isAnonymous,
          orderId: selectedOrderId
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit review");
      }

      setRating(0);
      setComment("");
      setIsAnonymous(false);
      setSelectedOrderId("");
      fetchEligibleOrders(); // Refresh eligible orders
      onSubmitted();
    } catch (error) {
      setError((error as Error).message || "An error occurred while submitting your review.");
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-lg text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
          <span className="text-2xl">🔒</span>
        </div>
        <p className="text-gray-200 text-lg font-medium mb-2">Sign In Required</p>
        <p className="text-gray-400 text-sm">Please sign in to write a review for this product.</p>
      </div>
    );
  }

  if (authLoading || loadingOrders) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-lg">
        <div className="space-y-4">
          <Skeleton className="h-6 w-32 bg-gray-700 rounded-md" />
          <Skeleton className="h-12 w-full bg-gray-700 rounded-xl" />
          <Skeleton className="h-20 w-full bg-gray-700 rounded-xl" />
        </div>
      </div>
    );
  }

  if (eligibleOrders.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="order" className="text-sm font-medium text-gray-200">
            Select Your Order
          </Label>
          <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-gray-100">
              <SelectValue placeholder="Choose the order to review" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {eligibleOrders.map((order) => (
                <SelectItem key={order.id} value={order.id.toString()}>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col text-left">
                      <span className="font-medium">Order #{order.orderNumber}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleDateString()}
                        <DollarSign className="w-3 h-3" />
                        ${order.totalAmount}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label htmlFor="rating" className="text-sm font-medium text-gray-200">
            Your Rating
          </Label>
          <StarRating rating={rating} setRating={setRating} />
        </div>

        <div className="space-y-3">
          <Label htmlFor="comment" className="text-sm font-medium text-gray-200">
            Your Review
          </Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
            placeholder="Tell us about your experience with this product..."
            className="bg-gray-800 border-gray-600 text-gray-100 placeholder:text-gray-400 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            rows={4}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="anonymous"
            checked={isAnonymous}
            onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
            className="border-gray-600 text-blue-600"
          />
          <Label htmlFor="anonymous" className="text-sm text-gray-300 cursor-pointer">
            Post this review anonymously
          </Label>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm p-3 rounded-xl">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          disabled={loading || rating < 1 || !selectedOrderId} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting Review...
            </div>
          ) : (
            "Submit Review"
          )}
        </Button>
      </form>
    </div>
  );
}

interface ReviewListProps {
  productId: number;
}

type Review = {
  id: number;
  rating: number;
  comment: string;
  user: string;
  date: string;
  isVerified: boolean;
  isAnonymous: boolean;
  orderNumber: string;
  helpfulCount: number;
};

function ReviewList({ productId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/review?productId=${productId}`);
      if (!res.ok) {
        setReviews([]);
        setLoading(false);
        return;
      }
      const text = await res.text();
      if (!text) {
        setReviews([]);
        setLoading(false);
        return;
      }
      const data = JSON.parse(text);
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    }
    setLoading(false);
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="h-12 w-12 rounded-full bg-gray-700" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-gray-700 rounded-md" />
                <Skeleton className="h-4 w-32 bg-gray-700 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-16 w-full bg-gray-700 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <div className="text-center py-16 bg-gray-900 border border-gray-700 rounded-2xl">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
          <span className="text-2xl">💭</span>
        </div>
        <p className="text-gray-200 text-lg font-medium">No reviews yet</p>
        <p className="text-gray-400 text-sm mt-1">Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-lg hover:bg-gray-800/70 transition-all duration-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="font-semibold text-gray-200 text-sm">
                {review.user.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-100 truncate">{review.user}</h4>
                  {review.isVerified && (
                    <span className="bg-green-900/50 text-green-300 text-xs px-2 py-1 rounded-full border border-green-700">
                      ✓ Verified Purchase
                    </span>
                  )}
                </div>
                <StarRating rating={review.rating} setRating={() => {}} readOnly />
              </div>

              <p className="text-gray-300 leading-relaxed mb-4">{review.comment}</p>

              <div className="flex items-center justify-between">
                <time className="text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                  {new Date(review.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
                
                <div className="text-xs text-gray-500">
                  Order #{review.orderNumber}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface ProductReviewSectionProps {
  productId: number;
}

export default function ProductReviewSection({ productId }: ProductReviewSectionProps) {
  const [refresh, setRefresh] = useState(0);
  
  return (
    <section className="mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-100 mb-2">Reviews & Ratings</h2>
        <p className="text-gray-400">Share your experience with this product</p>
      </div>

      {/* Review Statistics */}
      <div className="mb-8">
        <ProductReviewStats productId={productId} />
      </div>

      {/* Review Form */}
      <div className="mb-8">
        <ReviewForm productId={productId} onSubmitted={() => setRefresh((r) => r + 1)} />
      </div>

      {/* Review List */}
      <div className="space-y-6">

        <ReviewList productId={productId} key={refresh} />
      </div>
    </section>
  );
}