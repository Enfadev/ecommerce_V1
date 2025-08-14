"use client";

import { WishlistProvider } from "../components/wishlist-context";
import ClientRootLayout from "./ClientRootLayout";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <WishlistProvider>
      <div className="flex-1 flex flex-col">
        <ClientRootLayout>{children}</ClientRootLayout>
      </div>
    </WishlistProvider>
  );
}
