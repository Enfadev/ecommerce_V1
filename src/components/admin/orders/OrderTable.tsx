"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Order, OrderStatus, PaymentStatus, OrderPagination } from "@/types/order";
import { OrderTableRow } from "./OrderTableRow";

interface OrderTableProps {
  orders: Order[];
  pagination: OrderPagination;
  loading: boolean;
  updating: string | null;
  onViewDetail: (order: Order) => void;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  onPaymentStatusChange: (orderId: string, status: PaymentStatus) => void;
  onPageChange: (page: number) => void;
  onPrintInvoice: (order: Order) => void;
  isPrinting: boolean;
}

export function OrderTable({ orders, pagination, loading, updating, onViewDetail, onStatusChange, onPaymentStatusChange, onPageChange, onPrintInvoice, isPrinting }: OrderTableProps) {
  return (
    <Card className="border-0 shadow-lg">
      <div className="p-6 border-b bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Orders Database</h3>
              <p className="text-sm text-muted-foreground">{orders.length} orders found</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {orders.length} / {pagination.total}
          </Badge>
        </div>
      </div>

      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2 bg-muted/30">
              <TableHead className="text-left font-semibold w-[140px]">Order ID</TableHead>
              <TableHead className="text-left font-semibold w-[220px]">Customer</TableHead>
              <TableHead className="text-left font-semibold w-[180px]">Products</TableHead>
              <TableHead className="text-right font-semibold w-[120px]">Total</TableHead>
              <TableHead className="text-center font-semibold w-[140px]">Order Status</TableHead>
              <TableHead className="text-center font-semibold w-[120px]">Payment</TableHead>
              <TableHead className="text-center font-semibold w-[120px]">Date</TableHead>
              <TableHead className="text-center font-semibold w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <p className="text-lg">Loading orders...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                    <p className="text-muted-foreground">Try adjusting your search criteria or filters.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order, index) => (
                <OrderTableRow
                  key={order.id}
                  order={order}
                  index={index}
                  updating={updating}
                  isPrinting={isPrinting}
                  onViewDetail={onViewDetail}
                  onStatusChange={onStatusChange}
                  onPaymentStatusChange={onPaymentStatusChange}
                  onPrintInvoice={onPrintInvoice}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/30">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} orders
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onPageChange(pagination.page - 1)} disabled={pagination.page <= 1 || loading} className="gap-1">
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  const distance = Math.abs(page - pagination.page);
                  return distance === 0 || distance === 1 || page === 1 || page === pagination.totalPages;
                })
                .map((page, index, array) => {
                  const showEllipsis = index > 0 && page - array[index - 1] > 1;
                  return (
                    <div key={page} className="flex items-center">
                      {showEllipsis && <span className="px-2 text-muted-foreground">...</span>}
                      <Button variant={pagination.page === page ? "default" : "ghost"} size="sm" onClick={() => onPageChange(page)} className="w-9 h-9 p-0" disabled={loading}>
                        {page}
                      </Button>
                    </div>
                  );
                })}
            </div>

            <Button variant="outline" size="sm" onClick={() => onPageChange(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages || loading} className="gap-1">
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
