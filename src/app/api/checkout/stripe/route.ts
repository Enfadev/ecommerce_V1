import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { isAdminRequest } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: NextRequest) {
  try {
    if (await isAdminRequest(req)) {
      return NextResponse.json({ error: "Admin cannot access checkout features" }, { status: 403 });
    }

    const { items, email } = await req.json();
    const line_items = items.map((item: { name: string; price: number; quantity: number }) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
