import { NextApiRequest, NextApiResponse } from "next";


let reviews: Record<string, Array<{ rating: number; comment: string; user?: string; date: string }>> = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { productId } = req.query;
  if (!productId || typeof productId !== "string") {
    return res.status(400).json({ error: "productId required" });
  }

  if (req.method === "GET") {
    return res.status(200).json(reviews[productId] || []);
  }

  if (req.method === "POST") {
    const { rating, comment, user } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ error: "Rating & comment required" });
    }
    const review = {
      rating: Number(rating),
      comment: String(comment),
      user: user || "Anonim",
      date: new Date().toISOString(),
    };
    if (!reviews[productId]) reviews[productId] = [];
    reviews[productId].unshift(review);
    return res.status(201).json(review);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
