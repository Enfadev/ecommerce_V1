import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";


interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
  readOnly?: boolean;
}
function StarRating({ rating, setRating, readOnly = false }: StarRatingProps) {
  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`cursor-pointer text-2xl transition-colors ${star <= rating ? "text-yellow-400" : "text-gray-600 dark:text-gray-400"}`} onClick={() => !readOnly && setRating(star)} aria-label={`Rate ${star} star`}>
          ★
        </span>
      ))}
    </div>
  );
}


interface ReviewFormProps {
  productId: number;
  onSubmitted: () => void;
}
function ReviewForm({ productId, onSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (rating < 1) {
      setError("Silakan pilih rating.");
      setLoading(false);
      return;
    }
    if (comment.length < 5) {
      setError("Komentar minimal 5 karakter.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/review?productId=${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });
      if (!res.ok) throw new Error("Gagal submit review");
      setRating(0);
      setComment("");
      onSubmitted();
    } catch (err) {
      setError("Terjadi kesalahan.");
    }
    setLoading(false);
  };

  return (
    <Card className="p-4 bg-zinc-900 text-zinc-100 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Label htmlFor="rating">Rating</Label>
        <StarRating rating={rating} setRating={setRating} />
        <Label htmlFor="comment">Komentar</Label>
        <Textarea id="comment" value={comment} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)} placeholder="Tulis ulasan Anda..." className="bg-zinc-800 text-zinc-100" />
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Mengirim..." : "Kirim Review"}
        </Button>
      </form>
    </Card>
  );
}

// Review list
interface ReviewListProps {
  productId: number;
}
type Review = {
  rating: number;
  comment: string;
  user?: string;
  date: string;
};
function ReviewList({ productId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
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
    try {
      const data = JSON.parse(text);
      setReviews(Array.isArray(data) ? data : []);
    } catch {
      setReviews([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  if (loading) return <Skeleton className="h-32 w-full" />;
  if (!reviews.length) return <div className="text-zinc-400">Belum ada review.</div>;

  return (
    <div className="space-y-4">
      {reviews.map((r, idx) => (
        <Card key={idx} className="p-4 bg-zinc-800 text-zinc-100">
          <div className="flex items-center gap-2 mb-2">
            <Avatar>
              <span className="font-semibold text-base">{(r.user || "Anonim").charAt(0).toUpperCase()}</span>
            </Avatar>
            <span className="font-semibold">{r.user || "Anonim"}</span>
            <StarRating rating={r.rating} setRating={() => {}} readOnly />
          </div>
          <div className="text-sm">{r.comment}</div>
          <div className="text-xs text-zinc-400 mt-1">{new Date(r.date).toLocaleString()}</div>
        </Card>
      ))}
    </div>
  );
}

// Main Review & Rating component
interface ProductReviewSectionProps {
  productId: number;
}
export default function ProductReviewSection({ productId }: ProductReviewSectionProps) {
  const [refresh, setRefresh] = useState(0);
  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold mb-4 text-zinc-100">Review & Rating</h2>
      <ReviewForm productId={productId} onSubmitted={() => setRefresh((r) => r + 1)} />
      <Separator className="my-6" />
      <ReviewList productId={productId} key={refresh} />
    </section>
  );
}
