import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CheckoutFormProps {
  onSubmit: (data: { nama: string; email: string; alamat: string }) => void;
}

export function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const [form, setForm] = useState({ nama: "", email: "", alamat: "" });
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nama || !form.email || !form.alamat) {
      setError("Semua field wajib diisi.");
      return;
    }
    setError("");
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-lg p-6 flex flex-col gap-4 shadow">
      <input name="nama" placeholder="Nama Lengkap" className="input input-bordered bg-muted text-foreground rounded px-4 py-2" value={form.nama} onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" className="input input-bordered bg-muted text-foreground rounded px-4 py-2" value={form.email} onChange={handleChange} required />
      <textarea name="alamat" placeholder="Alamat Pengiriman" className="input input-bordered bg-muted text-foreground rounded px-4 py-2 min-h-[80px]" value={form.alamat} onChange={handleChange} required />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" className="w-full mt-2">
        Konfirmasi Pesanan
      </Button>
    </form>
  );
}
