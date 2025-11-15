"use client";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Eye, Edit, Trash2, Mail, Phone, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Customer } from "@/types/customer";
import { getStatusText, getStatusColor, getInitials, formatCurrency, formatDate, getDaysSince } from "@/lib/utils/customer-helpers";

interface CustomerTableRowProps {
  customer: Customer;
  index: number;
  startIndex: number;
  isPending: boolean;
  onViewDetail: (customer: Customer) => void;
  onStatusChange: (customerId: string, status: Customer["status"]) => void;
  onDelete: (customerId: string) => void;
}

export function CustomerTableRow({ customer, index, startIndex, isPending, onViewDetail, onStatusChange, onDelete }: CustomerTableRowProps) {
  return (
    <TableRow className="group hover:bg-muted/50 transition-all duration-200 border-b border-border/50">
      <TableCell className="font-mono text-sm text-muted-foreground py-6 w-[120px]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-medium">{startIndex + index + 1}</div>
          <span className="text-xs">#{customer.id.slice(-6)}</span>
        </div>
      </TableCell>

      <TableCell className="py-6 w-[280px]">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center ring-2 ring-primary/10">
              <span className="text-sm font-bold text-primary">{getInitials(customer.name)}</span>
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(customer.status)}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">{customer.name}</p>
            <p className="text-xs text-muted-foreground">Customer since {formatDate(customer.joinDate, { month: "short", year: "numeric" })}</p>
          </div>
        </div>
      </TableCell>

      <TableCell className="py-6 w-[240px]">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center">
              <Mail className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-foreground font-medium truncate max-w-[200px]">{customer.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-md flex items-center justify-center">
              <Phone className="w-3 h-3 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-muted-foreground">{customer.phone}</span>
          </div>
        </div>
      </TableCell>

      <TableCell className="text-center py-6 w-[140px]">
        <div className="space-y-1">
          <div className="text-2xl font-bold text-foreground">{customer.totalOrders}</div>
          <div className="text-xs text-muted-foreground">{customer.lastOrder && customer.lastOrder !== "Never" ? <>Last: {formatDate(customer.lastOrder, { month: "short", day: "numeric" })}</> : "No orders"}</div>
        </div>
      </TableCell>

      <TableCell className="text-right py-6 w-[160px]">
        <div className="space-y-1">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(customer.totalSpent)}</div>
          <div className="text-xs text-muted-foreground">{customer.totalOrders > 0 ? <>Avg: {formatCurrency(customer.totalSpent / customer.totalOrders)}</> : "No purchases"}</div>
        </div>
      </TableCell>

      <TableCell className="text-center py-6 w-[140px]">
        <div className="text-sm font-medium text-foreground">{formatDate(customer.joinDate, { month: "short", day: "numeric", year: "2-digit" })}</div>
        <div className="text-xs text-muted-foreground">{getDaysSince(customer.joinDate)} days ago</div>
      </TableCell>

      <TableCell className="text-center py-6 w-[120px]">
        <div className="flex items-center justify-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onViewDetail(customer)} className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30" disabled={isPending}>
            <Eye className="w-4 h-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted" disabled={isPending}>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="font-semibold">Quick Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onViewDetail(customer)} className="gap-2">
                <Eye className="w-4 h-4" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Edit className="w-4 h-4" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Mail className="w-4 h-4" />
                Send Message
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="font-semibold text-xs">Change Status</DropdownMenuLabel>
              {(["active", "inactive", "blocked"] as const).map((status) => (
                <DropdownMenuItem key={status} onClick={() => onStatusChange(customer.id, status)} disabled={customer.status === status} className="gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
                  {getStatusText(status)}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(customer.id)} className="text-destructive gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Customer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}
