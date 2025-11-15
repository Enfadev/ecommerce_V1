"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Package, MoreHorizontal, Loader2, ChevronLeft, ChevronRight, Printer } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Order, OrderStatus, PaymentStatus, OrderPagination } from "@/types/order";
import { getStatusColor, getStatusIcon, getStatusText, getPaymentStatusColor, getPaymentStatusText, getPaymentStatusDotColor, formatOrderDate, formatOrderTime, formatCurrency, getCustomerInitials } from "@/lib/order-utils";

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
                <TableRow key={order.id} className="group hover:bg-muted/50 transition-all duration-200 border-b border-border/50">
                  <TableCell className="font-mono text-sm py-6 w-[140px]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-medium">{index + 1}</div>
                      <span className="text-xs font-medium">#{order.id.slice(-8)}</span>
                    </div>
                  </TableCell>

                  <TableCell className="py-6 w-[220px]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-xl flex items-center justify-center ring-2 ring-blue-500/10">
                        <span className="text-sm font-bold text-blue-600">{getCustomerInitials(order.customer.name)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">{order.customer.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{order.customer.email}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-6 w-[180px]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-sm">
                          {order.items.length} item{order.items.length > 1 ? "s" : ""}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {order.items[0]?.productName}
                        {order.items.length > 1 && ` +${order.items.length - 1} more`}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell className="text-right py-6 w-[120px]">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(order.total)}</div>
                    <div className="text-xs text-muted-foreground">{order.items.length} items</div>
                  </TableCell>

                  <TableCell className="text-center py-6 w-[140px]">
                    <Badge className={`${getStatusColor(order.status)} font-medium px-3 py-1.5`} variant="outline">
                      <div className="flex items-center gap-1.5">
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </div>
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center py-6 w-[120px]">
                    <Badge className={`${getPaymentStatusColor(order.paymentStatus)} font-medium px-3 py-1`} variant="outline">
                      {getPaymentStatusText(order.paymentStatus)}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center py-6 w-[120px]">
                    <div className="text-sm font-medium text-foreground">{formatOrderDate(order.createdAt)}</div>
                    <div className="text-xs text-muted-foreground">{formatOrderTime(order.createdAt)}</div>
                  </TableCell>

                  <TableCell className="text-center py-6 w-[100px]">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => onViewDetail(order)} className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30">
                        <Eye className="w-4 h-4" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted" disabled={updating === order.id}>
                            {updating === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreHorizontal className="w-4 h-4" />}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel className="font-semibold">Quick Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onViewDetail(order)} className="gap-2">
                            <Eye className="w-4 h-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onPrintInvoice(order)} className="gap-2" disabled={isPrinting}>
                            {isPrinting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Printing...
                              </>
                            ) : (
                              <>
                                <Printer className="w-4 h-4" />
                                Print Invoice
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className="font-semibold text-xs">Change Order Status</DropdownMenuLabel>
                          {(["pending", "processing", "shipped", "delivered", "cancelled"] as OrderStatus[]).map((status) => (
                            <DropdownMenuItem key={status} onClick={() => onStatusChange(order.id, status)} disabled={order.status === status || updating === order.id} className="gap-2 text-xs">
                              {getStatusIcon(status)}
                              {getStatusText(status)}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className="font-semibold text-xs">Payment Status</DropdownMenuLabel>
                          {(["pending", "paid", "failed"] as PaymentStatus[]).map((paymentStatus) => (
                            <DropdownMenuItem key={paymentStatus} onClick={() => onPaymentStatusChange(order.id, paymentStatus)} disabled={order.paymentStatus === paymentStatus || updating === order.id} className="gap-2 text-xs">
                              <div className={`w-2 h-2 rounded-full ${getPaymentStatusDotColor(paymentStatus)}`} />
                              {getPaymentStatusText(paymentStatus)}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
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
