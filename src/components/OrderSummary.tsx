import React from "react";
import type { CartItem } from "@/components/cart-context";

interface OrderSummaryProps {
  items: CartItem[];
}

export function OrderSummary({ items }: OrderSummaryProps) {
  const total = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  return (
    <section className="bg-card rounded-lg p-6 shadow">
      <h2 className="text-lg font-bold mb-4">Ringkasan Pesanan</h2>
      {items.length === 0 ? (
        <div className="text-muted-foreground">Keranjang kosong.</div>
      ) : (
        <ul className="flex flex-col gap-2 mb-4">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between items-center">
              <span>
                {item.name} x{item.quantity || 1}
              </span>
              <span>Rp {(item.price * (item.quantity || 1)).toLocaleString("id-ID")}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-between font-semibold border-t pt-2 mt-2">
        <span>Total</span>
        <span>Rp {total.toLocaleString("id-ID")}</span>
      </div>
    </section>
  );
}
