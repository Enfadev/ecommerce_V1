import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Wishlist | Saved Products",
  description: "View and manage your wishlist, save your favorite products for later",
  openGraph: {
    title: "My Wishlist | Saved Products",
    description: "Keep track of your favorite products",
  },
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
