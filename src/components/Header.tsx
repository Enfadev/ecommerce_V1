"use client";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CartDrawer } from "./CartDrawer";
import { WishlistBadge } from "./WishlistBadge";
import { Search, Menu, Heart, User, ShoppingBag, LogOut, Settings, Crown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useAuth } from "./auth-context";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function Header() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { user, signOut, isAuthenticated } = useAuth();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/product?q=${encodeURIComponent(search)}`);
    } else {
      router.push("/product");
    }
  }

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-3 px-3 sm:px-4 lg:px-8" aria-label="Main Navigation">
        {/* Logo */}
        <Link href="/" className="font-bold text-2xl tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent hover:scale-105 transition-transform">
          ShopZone
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          <Link href="/product" className="text-sm font-medium hover:text-primary transition-colors">
            Products
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/event" className="text-sm font-medium hover:text-primary transition-colors">
            Events
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            Contact
          </Link>
          {user?.role === "ADMIN" && (
            <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
              <Crown className="h-3 w-3" />
              Admin
            </Link>
          )}
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-sm mx-8 hidden md:block">
          <form onSubmit={handleSearch} role="search" className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input type="text" placeholder="Search your favorite products..." className="pl-10 rounded-full bg-muted/40 border-none focus-visible:ring-2 focus-visible:ring-primary/50" value={search} onChange={(e) => setSearch(e.target.value)} />
          </form>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:space-x-2">
          {/* Mobile Search */}
          <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
            <Search className="h-4 w-4" />
          </Button>

          {/* Wishlist */}
          <div className="hidden sm:block">
            <WishlistBadge />
          </div>

          {/* Cart */}
          <CartDrawer />

          {/* User Menu */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-auto px-3 rounded-full">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">{getUserInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium">{user.name}</span>
                      {user.role === "ADMIN" && (
                        <Badge variant="secondary" className="text-xs bg-blue-600 text-white">
                          Admin
                        </Badge>
                      )}
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/order-history" className="flex items-center">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    <span>Order History</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wishlist" className="flex items-center">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Wishlist</span>
                  </Link>
                </DropdownMenuItem>
                {user.role === "ADMIN" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9 ml-1">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-4 border-b bg-muted/20">
                  <h2 className="font-semibold text-lg">Menu</h2>
                </div>
                
                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="flex flex-col space-y-1">
                    {/* User Info in Mobile */}
                    {isAuthenticated && user && (
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg mb-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-primary text-primary-foreground">{getUserInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    )}

                    {/* Navigation Links */}
                    <Link href="/product" className="flex items-center px-3 py-3 text-sm font-medium hover:bg-muted/50 rounded-lg transition-colors">
                      Products
                    </Link>
                    <Link href="/about" className="flex items-center px-3 py-3 text-sm font-medium hover:bg-muted/50 rounded-lg transition-colors">
                      About
                    </Link>
                    <Link href="/event" className="flex items-center px-3 py-3 text-sm font-medium hover:bg-muted/50 rounded-lg transition-colors">
                      Events
                    </Link>
                    <Link href="/contact" className="flex items-center px-3 py-3 text-sm font-medium hover:bg-muted/50 rounded-lg transition-colors">
                      Contact
                    </Link>

                    {user?.role === "ADMIN" && (
                      <Link href="/admin" className="flex items-center gap-2 px-3 py-3 text-sm font-medium hover:bg-muted/50 rounded-lg transition-colors">
                        <Crown className="h-4 w-4" />
                        Admin Panel
                      </Link>
                    )}

                    <hr className="my-4" />

                    {/* User Actions */}
                    {isAuthenticated ? (
                      <>
                        <Link href="/profile" className="flex items-center gap-2 px-3 py-3 text-sm font-medium hover:bg-muted/50 rounded-lg transition-colors">
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                        <Link href="/wishlist" className="flex items-center gap-2 px-3 py-3 text-sm font-medium hover:bg-muted/50 rounded-lg transition-colors">
                          <Heart className="h-4 w-4" />
                          Wishlist
                        </Link>
                        <Link href="/order-history" className="flex items-center gap-2 px-3 py-3 text-sm font-medium hover:bg-muted/50 rounded-lg transition-colors">
                          <ShoppingBag className="h-4 w-4" />
                          Order History
                        </Link>
                      </>
                    ) : (
                      <div className="space-y-2 mt-4">
                        <Button asChild className="w-full">
                          <Link href="/signin">Sign In</Link>
                        </Button>
                        <Button variant="outline" asChild className="w-full">
                          <Link href="/register">Register</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Footer - Sign Out Button */}
                {isAuthenticated && (
                  <div className="p-4 border-t bg-muted/10">
                    <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
