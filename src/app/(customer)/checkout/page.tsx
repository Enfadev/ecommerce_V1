"use client";

import { useCart } from "@/components/cart-context";
import { useOrders, CreateOrderData, Order } from "@/hooks/use-orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import StripeElementsWrapper from "@/components/StripeElementsWrapper";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowLeft, Package, CreditCard, Truck, Tag } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, clearCart, getTotalPrice, getTotalItems } = useCart();
  const { createOrder, creating } = useOrders();
  const [submitted, setSubmitted] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    phone: "",
    alamat: "",
    kodePos: "",
    catatan: "",
    paymentMethod: "Bank Transfer",
  });
  const router = useRouter();

  const subtotal = getTotalPrice();
  const ongkir = subtotal >= 250 ? 0 : 15; // Free shipping over $250
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + ongkir + tax;

  useEffect(() => {
    if (items.length === 0 && !submitted) {
      toast.error("Your cart is empty");
      router.push("/product");
    }
  }, [items.length, submitted, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi field
    if (!formData.nama || !formData.email || !formData.phone || !formData.alamat) {
      toast.error("Please complete all required fields");
      return;
    }
    if (!isValidEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Jika Credit Card, pembayaran dilakukan via Stripe Elements
    if (formData.paymentMethod === "Credit Card") {
      // Stripe Elements akan handle pembayaran, order dibuat setelah sukses
      return;
    }

    // Metode lain: langsung buat order
    const orderData: CreateOrderData = {
      customerName: formData.nama,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      shippingAddress: formData.alamat,
      postalCode: formData.kodePos,
      notes: formData.catatan,
      paymentMethod: formData.paymentMethod,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      subtotal,
      shippingFee: ongkir,
      tax,
      discount: 0,
      totalAmount: total,
    };
    try {
      const newOrder = await createOrder(orderData);
      if (newOrder) {
        setCreatedOrder(newOrder);
        setSubmitted(true);
        clearCart();
        toast.success("Order placed successfully!");
      }
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <main className="max-w-2xl mx-auto px-4 py-16">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
              <p className="text-muted-foreground mb-6">Thank you for your order. We will process it and send confirmation to your email soon.</p>

              {createdOrder && (
                <div className="bg-muted/30 rounded-lg p-4 mb-6 text-left">
                  <h3 className="font-semibold mb-2">Order Details</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Order Number:</span>
                      <span className="font-mono">{createdOrder.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="font-semibold">${createdOrder.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span>{createdOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge variant="secondary">{createdOrder.status}</Badge>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/order-history">View Orders</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground">Fill in your information to complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nama">Full Name *</Label>
                      <Input id="nama" name="nama" value={formData.nama} onChange={handleInputChange} placeholder="Enter your full name" required />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="08xxxxxxxxxx" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="email@example.com" required />
                  </div>
                  <div>
                    <Label htmlFor="alamat">Full Address *</Label>
                    <Textarea id="alamat" name="alamat" value={formData.alamat} onChange={handleInputChange} placeholder="Street, District, City, etc." required rows={3} />
                  </div>
                  <div>
                    <Label htmlFor="kodePos">Postal Code</Label>
                    <Input id="kodePos" name="kodePos" value={formData.kodePos} onChange={handleInputChange} placeholder="12345" />
                  </div>
                  <div>
                    <Label htmlFor="catatan">Additional Notes</Label>
                    <Textarea id="catatan" name="catatan" value={formData.catatan} onChange={handleInputChange} placeholder="Notes for courier or store (optional)" rows={2} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {/* Bank Transfer */}
                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${formData.paymentMethod === "Bank Transfer" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}
                      onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: "Bank Transfer" }))}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${formData.paymentMethod === "Bank Transfer" ? "bg-primary" : "bg-muted"}`}></div>
                        <div>
                          <p className="font-medium">Bank Transfer</p>
                          <p className="text-sm text-muted-foreground">Pay via bank transfer (manual confirmation)</p>
                        </div>
                      </div>
                    </div>

                    {/* E-Wallet */}
                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${formData.paymentMethod === "E-Wallet" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}
                      onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: "E-Wallet" }))}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${formData.paymentMethod === "E-Wallet" ? "bg-primary" : "bg-muted"}`}></div>
                        <div>
                          <p className="font-medium">E-Wallet</p>
                          <p className="text-sm text-muted-foreground">PayPal, Alipay, WeChat Pay</p>
                        </div>
                      </div>
                    </div>

                    {/* Credit Card */}
                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${formData.paymentMethod === "Credit Card" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}
                      onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: "Credit Card" }))}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${formData.paymentMethod === "Credit Card" ? "bg-primary" : "bg-muted"}`}></div>
                        <div>
                          <p className="font-medium">Credit Card</p>
                          <p className="text-sm text-muted-foreground">Visa, Mastercard, JCB</p>
                        </div>
                      </div>
                    </div>

                    {/* Cash on Delivery */}
                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${formData.paymentMethod === "Cash on Delivery" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}
                      onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: "Cash on Delivery" }))}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${formData.paymentMethod === "Cash on Delivery" ? "bg-primary" : "bg-muted"}`}></div>
                        <div>
                          <p className="font-medium">Cash on Delivery</p>
                          <p className="text-sm text-muted-foreground">Pay when package arrives</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Area pembayaran */}
              {formData.paymentMethod === "Credit Card" ? (
                <div className="pt-4">
                  <StripeElementsWrapper
                    amount={total}
                    email={formData.email}
                    orderData={{
                      customerName: formData.nama,
                      customerEmail: formData.email,
                      customerPhone: formData.phone,
                      shippingAddress: formData.alamat,
                      postalCode: formData.kodePos,
                      notes: formData.catatan,
                      paymentMethod: formData.paymentMethod,
                      items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
                      subtotal,
                      shippingFee: ongkir,
                      tax,
                      discount: 0,
                      totalAmount: total,
                    }}
                    onPaymentSuccess={(order: Order) => {
                      setCreatedOrder(order);
                      setSubmitted(true);
                      clearCart();
                      toast.success("Order placed successfully!");
                    }}
                  />
                </div>
              ) : formData.paymentMethod === "E-Wallet" ? (
                <div className="pt-4 flex flex-col gap-4">
                  <PayPalButton
                    total={total}
                    currency="USD"
                    onApprove={async (details) => {
                      const orderData = {
                        customerName: formData.nama,
                        customerEmail: formData.email,
                        customerPhone: formData.phone,
                        shippingAddress: formData.alamat,
                        postalCode: formData.kodePos,
                        notes: formData.catatan,
                        paymentMethod: "PayPal",
                        items: items.map(item => ({ productId: item.productId, quantity: item.quantity })),
                        subtotal,
                        shippingFee: ongkir,
                        tax,
                        discount: 0,
                        totalAmount: total,
                      };
                      try {
                        const newOrder = await createOrder(orderData);
                        if (newOrder) {
                          setCreatedOrder(newOrder);
                          setSubmitted(true);
                          clearCart();
                          toast.success("Order placed successfully via PayPal!");
                        }
                      } catch {
                        toast.error("Failed to save order after PayPal payment.");
                      }
                    }}
                    onError={() => toast.error("PayPal payment failed.")}
                  />
                </div>
              ) : (
                <Button type="button" className="w-full" size="lg" disabled={creating} onClick={handleSubmit}>
                  {creating ? "Processing..." : `Place Order - $${total.toFixed(2)}`}
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      {item.image ? (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-muted-foreground">x{typeof item.quantity === "number" && item.quantity > 0 ? item.quantity : 1}</span>
                          <span className="text-sm font-semibold">${typeof item.price === "number" && typeof item.quantity === "number" && item.price > 0 && item.quantity > 0 ? (item.price * item.quantity).toFixed(2) : "0.00"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      Subtotal ({getTotalItems()} item{getTotalItems() > 1 ? "s" : ""})
                    </span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      Shipping Fee
                      {ongkir === 0 && (
                        <Badge variant="secondary" className="text-xs">
                          FREE
                        </Badge>
                      )}
                    </span>
                    <span>${ongkir.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  {subtotal < 250 && ongkir > 0 && <p className="text-xs text-muted-foreground">Free shipping for orders over $250.00</p>}
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
