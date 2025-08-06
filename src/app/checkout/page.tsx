"use client";

import { useCart } from "../../components/cart-context";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowLeft, Package, CreditCard, Truck, Tag } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, clearCart, getTotalPrice, getTotalItems } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    phone: "",
    alamat: "",
    kodePos: "",
    catatan: "",
  });
  const router = useRouter();

  const subtotal = getTotalPrice();
  const ongkir = subtotal >= 250000 ? 0 : 15000;
  const total = subtotal + ongkir;

  
  useEffect(() => {
    if (items.length === 0 && !submitted) {
      toast.error("Keranjang belanja kosong");
      router.push("/product");
    }
  }, [items.length, submitted, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    
    if (!formData.nama || !formData.email || !formData.phone || !formData.alamat) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      setIsSubmitting(false);
      return;
    }

    
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setSubmitted(true);
    clearCart();
    toast.success("Pesanan berhasil dibuat!");
    setIsSubmitting(false);
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
              <h1 className="text-2xl font-bold mb-2">Pesanan Berhasil Dibuat!</h1>
              <p className="text-muted-foreground mb-6">Terima kasih atas pesanan Anda. Kami akan segera memproses dan mengirimkan konfirmasi ke email Anda.</p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/order-history">Lihat Pesanan</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Kembali ke Beranda</Link>
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
              Kembali
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground">Lengkapi informasi untuk menyelesaikan pesanan</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Checkout */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Informasi Pengiriman
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nama">Nama Lengkap *</Label>
                      <Input id="nama" name="nama" value={formData.nama} onChange={handleInputChange} placeholder="Masukkan nama lengkap" required />
                    </div>
                    <div>
                      <Label htmlFor="phone">Nomor Telepon *</Label>
                      <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="08xxxxxxxxxx" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="email@example.com" required />
                  </div>
                  <div>
                    <Label htmlFor="alamat">Alamat Lengkap *</Label>
                    <Textarea id="alamat" name="alamat" value={formData.alamat} onChange={handleInputChange} placeholder="Jl. Contoh No. 123, RT/RW, Kelurahan, Kecamatan, Kota" required rows={3} />
                  </div>
                  <div>
                    <Label htmlFor="kodePos">Kode Pos</Label>
                    <Input id="kodePos" name="kodePos" value={formData.kodePos} onChange={handleInputChange} placeholder="12345" />
                  </div>
                  <div>
                    <Label htmlFor="catatan">Catatan Tambahan</Label>
                    <Textarea id="catatan" name="catatan" value={formData.catatan} onChange={handleInputChange} placeholder="Catatan untuk kurir atau toko (opsional)" rows={2} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Metode Pembayaran
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <div>
                        <p className="font-medium">Transfer Bank</p>
                        <p className="text-sm text-muted-foreground">Pembayaran via transfer bank (Konfirmasi manual)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Memproses..." : `Buat Pesanan - Rp ${total.toLocaleString()}`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  Ringkasan Pesanan
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
                          <span className="text-sm text-muted-foreground">x{item.qty}</span>
                          <span className="text-sm font-semibold">Rp {(item.price * item.qty).toLocaleString()}</span>
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
                    <span>Rp {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      Ongkos Kirim
                      {ongkir === 0 && (
                        <Badge variant="secondary" className="text-xs">
                          GRATIS
                        </Badge>
                      )}
                    </span>
                    <span>Rp {ongkir.toLocaleString()}</span>
                  </div>
                  {subtotal < 250000 && ongkir > 0 && <p className="text-xs text-muted-foreground">Gratis ongkir untuk pembelian min. Rp 250.000</p>}
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>Rp {total.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
