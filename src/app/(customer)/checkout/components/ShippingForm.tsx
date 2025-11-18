"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

interface ShippingFormProps {
  formData: {
    nama: string;
    email: string;
    phone: string;
    alamat: string;
    kodePos: string;
    catatan: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isValidEmail: (email: string) => boolean;
}

export function ShippingForm({ formData, onChange, isValidEmail }: ShippingFormProps) {
  return (
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
            <Label htmlFor="nama" className={!formData.nama.trim() ? "text-red-600" : ""}>
              Full Name *
            </Label>
            <Input id="nama" name="nama" value={formData.nama} onChange={onChange} placeholder="Enter your full name" required className={!formData.nama.trim() ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""} />
            {!formData.nama.trim() && <p className="text-red-600 text-xs mt-1">Full name is required</p>}
          </div>
          <div>
            <Label htmlFor="phone" className={!formData.phone.trim() ? "text-red-600" : ""}>
              Phone Number *
            </Label>
            <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={onChange} placeholder="08xxxxxxxxxx" required className={!formData.phone.trim() ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""} />
            {!formData.phone.trim() && <p className="text-red-600 text-xs mt-1">Phone number is required</p>}
          </div>
        </div>
        <div>
          <Label htmlFor="email" className={!formData.email.trim() || (formData.email.trim() && !isValidEmail(formData.email)) ? "text-red-600" : ""}>
            Email *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            placeholder="email@example.com"
            required
            className={!formData.email.trim() || (formData.email.trim() && !isValidEmail(formData.email)) ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}
          />
          {!formData.email.trim() && <p className="text-red-600 text-xs mt-1">Email is required</p>}
          {formData.email.trim() && !isValidEmail(formData.email) && <p className="text-red-600 text-xs mt-1">Please enter a valid email address</p>}
        </div>
        <div>
          <Label htmlFor="alamat" className={!formData.alamat.trim() ? "text-red-600" : ""}>
            Full Address *
          </Label>
          <Textarea
            id="alamat"
            name="alamat"
            value={formData.alamat}
            onChange={onChange}
            placeholder="Street, District, City, etc."
            required
            rows={3}
            className={!formData.alamat.trim() ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}
          />
          {!formData.alamat.trim() && <p className="text-red-600 text-xs mt-1">Full address is required</p>}
        </div>
        <div>
          <Label htmlFor="kodePos">Postal Code</Label>
          <Input id="kodePos" name="kodePos" value={formData.kodePos} onChange={onChange} placeholder="12345" />
        </div>
        <div>
          <Label htmlFor="catatan">Additional Notes</Label>
          <Textarea id="catatan" name="catatan" value={formData.catatan} onChange={onChange} placeholder="Notes for courier or store (optional)" rows={2} />
        </div>
      </CardContent>
    </Card>
  );
}
