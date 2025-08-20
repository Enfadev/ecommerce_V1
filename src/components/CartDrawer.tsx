"use client";

import { useCart } from "./cart-context";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter, DrawerClose } from "../components/ui/drawer";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Plus, Minus, Trash2, X, Tag, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export function CartDrawer() {
  const { items, removeFromCart, clearCart, updateQty } = useCart();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleCheckout = () => {
    setOpen(false);
    router.push("/checkout");
    toast.success("Proceeding to checkout page...");
  };

  const handleRemoveItem = async (id: number, name: string) => {
    await removeFromCart(id);
    toast.success(`${name} has been removed from the cart`);
  };

  const handleClearCart = async () => {
    await clearCart();
    toast.success("Cart has been emptied");
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary hover:bg-primary/80">{totalItems > 99 ? "99+" : totalItems}</Badge>}
          <span className="sr-only">Shopping Cart</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-md mx-auto max-h-[85vh]">
        <DrawerHeader className="text-left pb-4">
          <div className="flex items-center justify-between">
            <DrawerTitle className="flex items-center gap-2 text-xl font-bold">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Shopping Cart
              {totalItems > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {totalItems} item{totalItems > 1 ? "s" : ""}
                </Badge>
              )}
            </DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Cart is Empty</h3>
              <p className="text-muted-foreground mb-6">No products have been added to the cart yet</p>
              <DrawerClose asChild>
                <Button onClick={() => router.push("/product")}>Start Shopping</Button>
              </DrawerClose>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {item.image ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Tag className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 mb-1">{item.name}</h4>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-primary">{item.price.toLocaleString("en-US", { style: "currency", currency: "USD" })}</div>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(item.id, item.name)} className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="outline" size="sm" onClick={() => updateQty(item.id, item.quantity - 1)} disabled={item.quantity === 1} className="h-8 w-8 p-0">
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button variant="outline" size="sm" onClick={() => updateQty(item.id, item.quantity + 1)} className="h-8 w-8 p-0">
                            <Plus className="h-3 w-3" />
                          </Button>
                          <div className="ml-auto text-sm font-semibold">{(item.price * item.quantity).toLocaleString("en-US", { style: "currency", currency: "USD" })}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <DrawerFooter className="pt-4 border-t">
            <div className="space-y-4">
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Subtotal ({totalItems} item{totalItems > 1 ? "s" : ""})
                </span>
                <span className="text-lg font-bold">{total.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>
              </div>

              <div className="grid gap-2">
                <Button onClick={handleCheckout} className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
                <Button variant="outline" onClick={handleClearCart} className="w-full">
                  Empty Cart
                </Button>
              </div>
            </div>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
