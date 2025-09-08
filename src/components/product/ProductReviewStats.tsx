import React, { useState, useEffect } from "react";
import { Star, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ReviewStatsProps {
  productId: number;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  distribution: Array<{
    rating: number;
    count: number;
    percentage: number;
  }>;
}

export default function ProductReviewStats({ productId }: ReviewStatsProps) {
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/review/stats?productId=${productId}`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching review stats:", error);
      }
      setLoading(false);
    };

    fetchStats();
  }, [productId]);

  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-lg">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48 bg-gray-700 rounded-md" />
          <Skeleton className="h-16 w-full bg-gray-700 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!stats || stats.totalReviews === 0) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-lg text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
          <BarChart3 className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-200 text-lg font-medium">No ratings yet</p>
        <p className="text-gray-400 text-sm">Be the first to rate this product</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-lg">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-100 mb-2">Customer Reviews</h3>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 ${
                  star <= Math.round(stats.averageRating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-2xl font-bold text-gray-100">
            {stats.averageRating.toFixed(1)}
          </span>
        </div>
        <p className="text-gray-400 text-sm">
          Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-3">
        {stats.distribution.map((item) => (
          <div key={item.rating} className="flex items-center gap-3">
            <div className="flex items-center gap-1 w-12">
              <span className="text-sm text-gray-300">{item.rating}</span>
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </div>
            
            <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            
            <div className="text-sm text-gray-400 w-8 text-right">
              {item.count}
            </div>
            
            <div className="text-sm text-gray-400 w-10 text-right">
              {item.percentage}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
