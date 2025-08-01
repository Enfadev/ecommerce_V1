"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Filter, Calendar as CalendarIcon, X, RotateCcw } from "lucide-react";
import { OrderStatus } from "./OrderHistoryPage";

interface AdvancedFilterModalProps {
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export interface FilterOptions {
  searchQuery: string;
  status: string;
  minAmount?: number;
  maxAmount?: number;
  paymentMethod: string;
}

export default function AdvancedFilterModal({ onApplyFilters, currentFilters }: AdvancedFilterModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  const statusOptions = [
    { value: "all", label: "Semua Status" },
    { value: "Pending", label: "Menunggu Konfirmasi" },
    { value: "Processing", label: "Sedang Diproses" },
    { value: "Shipped", label: "Dalam Pengiriman" },
    { value: "Delivered", label: "Pesanan Selesai" },
    { value: "Cancelled", label: "Dibatalkan" },
    { value: "Returned", label: "Dikembalikan" },
  ];

  const paymentMethodOptions = [
    { value: "all", label: "Semua Metode" },
    { value: "Credit Card", label: "Kartu Kredit" },
    { value: "Bank Transfer", label: "Transfer Bank" },
    { value: "E-Wallet", label: "E-Wallet" },
    { value: "COD", label: "Bayar di Tempat" },
  ];

  const handleApply = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      searchQuery: "",
      status: "all",
      minAmount: undefined,
      maxAmount: undefined,
      paymentMethod: "all",
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
    setIsOpen(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.status !== "all") count++;
    if (filters.minAmount || filters.maxAmount) count++;
    if (filters.paymentMethod !== "all") count++;
    return count;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filter Lanjutan
          {getActiveFilterCount() > 0 && (
            <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Lanjutan</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Query */}
          <div className="space-y-2">
            <Label>Cari Pesanan</Label>
            <Input placeholder="Nomor pesanan atau nama produk..." value={filters.searchQuery} onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))} />
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label>Status Pesanan</Label>
            <Select value={filters.status} onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Rentang Tanggal</Label>
            <div className="text-sm text-muted-foreground p-2 border rounded">Filter tanggal akan ditambahkan di update berikutnya</div>
          </div>

          {/* Amount Range */}
          <div className="space-y-2">
            <Label>Rentang Harga</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input type="number" placeholder="Min (Rp)" value={filters.minAmount || ""} onChange={(e) => setFilters((prev) => ({ ...prev, minAmount: e.target.value ? Number(e.target.value) : undefined }))} />
              <Input type="number" placeholder="Max (Rp)" value={filters.maxAmount || ""} onChange={(e) => setFilters((prev) => ({ ...prev, maxAmount: e.target.value ? Number(e.target.value) : undefined }))} />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label>Metode Pembayaran</Label>
            <Select value={filters.paymentMethod} onValueChange={(value) => setFilters((prev) => ({ ...prev, paymentMethod: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentMethodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleApply} className="flex-1">
              Terapkan Filter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
