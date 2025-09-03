"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "./auth-context";

export type CartItem = {
  id: number;
  productId: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  selected?: boolean;
  product?: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
    images?: Array<{ url: string }>;
    stock: number;
  };
};

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  addToCart: (item: { id: number; name: string; price: number; image?: string }) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  updateQty: (id: number, qty: number) => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  toggleItemSelection: (id: number) => Promise<void>;
  selectAllItems: () => Promise<void>;
  deselectAllItems: () => Promise<void>;
  removeSelectedItems: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }

    if (user?.role === "ADMIN") {
      setItems([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/cart", {
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        const cartItems: CartItem[] = data.items?.map((item: {
          id: number;
          productId: number;
          quantity: number;
          selected: boolean;
          product: {
            id: number;
            name: string;
            price: number;
            discountPrice?: number;
            promoExpired?: string | Date;
            imageUrl?: string;
            images?: Array<{ url: string }>;
            stock: number;
          };
        }) => {
          let finalPrice = item.product.price;
          if (item.product.discountPrice && 
              item.product.discountPrice > 0 && 
              item.product.discountPrice < item.product.price &&
              (!item.product.promoExpired || new Date(item.product.promoExpired) > new Date())) {
            finalPrice = item.product.discountPrice;
          }

          return {
            id: item.id,
            productId: item.productId,
            name: item.product.name,
            price: finalPrice,
            image: item.product.imageUrl || item.product.images?.[0]?.url,
            quantity: item.quantity,
            selected: item.selected,
            product: item.product
          };
        }) || [];
        
        setItems(cartItems);
      } else {
        console.error("Failed to fetch cart");
        setItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.role]);

  useEffect(() => {
    if (isAuthenticated && user) {
      refreshCart();
    } else {
      setItems([]);
    }
  }, [isAuthenticated, user, refreshCart]);

  async function addToCart(item: { id: number; name: string; price: number; image?: string }) {
    if (!isAuthenticated) {
      toast.error("Please sign in to add items to cart");
      return;
    }

    if (user?.role === "ADMIN") {
      toast.error("Cart feature is not available for admin users");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          productId: item.id,
          quantity: 1
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || "Item added to cart");
        await refreshCart();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    } finally {
      setIsLoading(false);
    }
  }

  async function removeFromCart(id: number) {
    if (!isAuthenticated) return;
    
    if (user?.role === "ADMIN") {
      toast.error("Cart feature is not available for admin users");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || "Item removed from cart");
        await refreshCart();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item from cart");
    } finally {
      setIsLoading(false);
    }
  }

  async function clearCart() {
    if (!isAuthenticated) return;

    if (user?.role === "ADMIN") {
      toast.error("Cart feature is not available for admin users");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/cart", {
        method: "DELETE",
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || "Cart cleared");
        setItems([]);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to clear cart");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    } finally {
      setIsLoading(false);
    }
  }

  async function updateQty(id: number, qty: number) {
    if (!isAuthenticated || qty < 1) return;

    if (user?.role === "ADMIN") {
      toast.error("Cart feature is not available for admin users");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/cart/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ quantity: qty })
      });

      if (response.ok) {
        await refreshCart();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    } finally {
      setIsLoading(false);
    }
  }

  function getTotalItems() {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  function getTotalPrice() {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  async function toggleItemSelection(id: number) {
    if (!isAuthenticated) return;

    if (user?.role === "ADMIN") {
      toast.error("Cart feature is not available for admin users");
      return;
    }

    try {
      const currentItem = items.find(item => item.id === id);
      if (!currentItem) return;

      setIsLoading(true);
      const response = await fetch(`/api/cart/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ selected: !currentItem.selected })
      });

      if (response.ok) {
        await refreshCart();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update selection");
      }
    } catch (error) {
      console.error("Error toggling selection:", error);
      toast.error("Failed to update selection");
    } finally {
      setIsLoading(false);
    }
  }

  async function selectAllItems() {
    if (!isAuthenticated) return;

    if (user?.role === "ADMIN") {
      toast.error("Cart feature is not available for admin users");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/cart/bulk", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ action: "select_all" })
      });

      if (response.ok) {
        await refreshCart();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to select all items");
      }
    } catch (error) {
      console.error("Error selecting all items:", error);
      toast.error("Failed to select all items");
    } finally {
      setIsLoading(false);
    }
  }

  async function deselectAllItems() {
    if (!isAuthenticated) return;

    if (user?.role === "ADMIN") {
      toast.error("Cart feature is not available for admin users");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/cart/bulk", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ action: "deselect_all" })
      });

      if (response.ok) {
        await refreshCart();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to deselect all items");
      }
    } catch (error) {
      console.error("Error deselecting all items:", error);
      toast.error("Failed to deselect all items");
    } finally {
      setIsLoading(false);
    }
  }

  async function removeSelectedItems() {
    if (!isAuthenticated) return;

    if (user?.role === "ADMIN") {
      toast.error("Cart feature is not available for admin users");
      return;
    }

    const selectedCount = items.filter((item) => item.selected).length;
    if (selectedCount === 0) {
      toast.error("No items selected");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/cart/bulk", {
        method: "DELETE",
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || `${selectedCount} item(s) removed from cart`);
        await refreshCart();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to remove selected items");
      }
    } catch (error) {
      console.error("Error removing selected items:", error);
      toast.error("Failed to remove selected items");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
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
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
