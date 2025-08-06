"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type SavedItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  savedAt: Date;
};

interface SavedItemsContextType {
  savedItems: SavedItem[];
  saveForLater: (item: Omit<SavedItem, "savedAt">) => void;
  removeFromSaved: (id: string) => void;
  moveToCart: (id: string) => void;
  clearSaved: () => void;
}

const SavedItemsContext = createContext<SavedItemsContextType | undefined>(undefined);

export function useSavedItems() {
  const ctx = useContext(SavedItemsContext);
  if (!ctx) throw new Error("useSavedItems must be used within SavedItemsProvider");
  return ctx;
}

export function SavedItemsProvider({ children }: { children: ReactNode }) {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  
  useEffect(() => {
    try {
      const saved = localStorage.getItem("saved-items");
      if (saved) {
        const parsedItems = JSON.parse(saved).map((item: any) => ({
          ...item,
          savedAt: new Date(item.savedAt),
        }));
        setSavedItems(parsedItems);
      }
    } catch (error) {
      console.error("Error loading saved items:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("saved-items", JSON.stringify(savedItems));
      } catch (error) {
        console.error("Error saving items to localStorage:", error);
      }
    }
  }, [savedItems, isLoaded]);

  function saveForLater(item: Omit<SavedItem, "savedAt">) {
    setSavedItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) return prev;
      return [...prev, { ...item, savedAt: new Date() }];
    });
  }

  function removeFromSaved(id: string) {
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
  }

  function moveToCart(id: string) {
    
    removeFromSaved(id);
  }

  function clearSaved() {
    setSavedItems([]);
  }

  if (!isLoaded) return null;

  return (
    <SavedItemsContext.Provider
      value={{
        savedItems,
        saveForLater,
        removeFromSaved,
        moveToCart,
        clearSaved,
      }}
    >
      {children}
    </SavedItemsContext.Provider>
  );
}
