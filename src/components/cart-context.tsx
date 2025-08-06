"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
  selected?: boolean;
};

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "qty" | "selected">) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQty: (id: string, qty: number) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  toggleItemSelection: (id: string) => void;
  selectAllItems: () => void;
  deselectAllItems: () => void;
  removeSelectedItems: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addToCart(item: Omit<CartItem, "qty" | "selected">) {
    setItems((prev) => {
      const exist = prev.find((i) => i.id === item.id);
      if (exist) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, qty: 1, selected: true }];
    });
  }

  function removeFromCart(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  function updateQty(id: string, qty: number) {
    if (qty < 1) return;

    setItems((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          const newQty = Math.max(1, qty);
          return { ...i, qty: newQty };
        }
        return i;
      })
    );
  }

  function getTotalItems() {
    return items.reduce((sum, item) => sum + item.qty, 0);
  }

  function getTotalPrice() {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function toggleItemSelection(id: string) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item)));
  }

  function selectAllItems() {
    setItems((prev) => prev.map((item) => ({ ...item, selected: true })));
  }

  function deselectAllItems() {
    setItems((prev) => prev.map((item) => ({ ...item, selected: false })));
  }

  function removeSelectedItems() {
    const selectedCount = items.filter((item) => item.selected).length;
    setItems((prev) => prev.filter((item) => !item.selected));
    if (selectedCount > 0) {
      toast.success(`${selectedCount} item${selectedCount > 1 ? "s" : ""} telah dihapus dari keranjang`);
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        updateQty,
        getTotalItems,
        getTotalPrice,
        toggleItemSelection,
        selectAllItems,
        deselectAllItems,
        removeSelectedItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
