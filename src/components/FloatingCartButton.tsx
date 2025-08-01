"use client";

import { useCart } from "./cart-context";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter, DrawerClose } from "./ui/drawer";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Plus, Minus, Trash2, X, Tag, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export function FloatingCartButton() {
  const { items, removeFromCart, clearCart, updateQty, getTotalItems, getTotalPrice } = useCart();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const router = useRouter();

  const handleCheckout = () => {
    router.push("/checkout");
    toast.success("Menuju halaman checkout...");
  };

  const handleRemoveItem = (id: string, name: string) => {
    removeFromCart(id);
    toast.success(`${name} telah dihapus dari keranjang`);
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("Keranjang telah dikosongkan");
  };

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 md:hidden">
      <Drawer>
        <DrawerTrigger asChild>
          <Button size="lg" className="rounded-full shadow-lg h-14 w-14 relative">
            <ShoppingCart className="h-6 w-6" />
            <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-500/80">{totalItems > 99 ? "99+" : totalItems}</Badge>
          </Button>
        </DrawerTrigger>

        <DrawerContent className="max-w-md mx-auto max-h-[85vh]">
          <DrawerHeader className="text-left pb-4">
            <div className="flex items-center justify-between">
              <DrawerTitle className="flex items-center gap-2 text-xl font-bold">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Keranjang Belanja
                <Badge variant="secondary" className="ml-2">
                  {totalItems} item{totalItems > 1 ? "s" : ""}
                </Badge>
              </DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-4 pb-4">
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
                          <div className="text-sm font-semibold text-primary">Rp {item.price.toLocaleString()}</div>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(item.id, item.name)} className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="outline" size="sm" onClick={() => updateQty(item.id, item.qty - 1)} disabled={item.qty === 1} className="h-8 w-8 p-0">
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.qty}</span>
                          <Button variant="outline" size="sm" onClick={() => updateQty(item.id, item.qty + 1)} className="h-8 w-8 p-0">
                            <Plus className="h-3 w-3" />
                          </Button>
                          <div className="ml-auto text-sm font-semibold">Rp {(item.price * item.qty).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <DrawerFooter className="pt-4 border-t">
            <div className="space-y-4">
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Total ({totalItems} item{totalItems > 1 ? "s" : ""})
                </span>
                <span className="text-lg font-bold">Rp {totalPrice.toLocaleString()}</span>
              </div>

              <div className="grid gap-2">
                <DrawerClose asChild>
                  <Button onClick={handleCheckout} className="w-full" size="lg">
                    Lanjutkan ke Checkout
                  </Button>
                </DrawerClose>
                <Button variant="outline" onClick={handleClearCart} className="w-full">
                  Kosongkan Keranjang
                </Button>
              </div>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Price indicator */}
      <div className="absolute -top-12 -left-16 bg-background border rounded-lg px-3 py-1 shadow-lg">
        <span className="text-xs font-medium">Rp {totalPrice.toLocaleString()}</span>
      </div>
    </div>
  );
}
