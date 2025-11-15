"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { PaginationControls, PaginationData } from "./PaginationControls";

interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface AdminTableProps<T> {
  title: string;
  description?: string;
  icon?: LucideIcon;
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: LucideIcon;
  keyExtractor: (item: T) => string | number;
  pagination?: PaginationData;
  onPageChange?: (page: number) => void;
  headerActions?: ReactNode;
  rowClassName?: (item: T) => string;
}

export function AdminTable<T>({
  title,
  description,
  icon: Icon,
  data,
  columns,
  loading = false,
  emptyMessage = "No data found",
  emptyIcon: EmptyIcon,
  keyExtractor,
  pagination,
  onPageChange,
  headerActions,
  rowClassName,
}: AdminTableProps<T>) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
              </div>
            )}
            <div>
              <CardTitle>{title}</CardTitle>
              {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            </div>
          </div>
          {headerActions}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 bg-muted/30">
                {columns.map((column, index) => (
                  <TableHead key={index} className={column.className}>
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-12">
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <p className="text-lg">Loading...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-12">
                    <div className="text-center">
                      {EmptyIcon && (
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                          <EmptyIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <p className="text-lg font-semibold mb-2">{emptyMessage}</p>
                      <p className="text-muted-foreground">Try adjusting your filters or search criteria.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow key={keyExtractor(item)} className={rowClassName ? rowClassName(item) : "hover:bg-muted/50 transition-colors"}>
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex} className={column.className}>
                        {column.render ? column.render(item) : column.accessor ? String(item[column.accessor]) : null}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {pagination && onPageChange && !loading && data.length > 0 && (
          <div className="px-6 py-4 border-t bg-muted/30">
            <PaginationControls pagination={pagination} onPageChange={onPageChange} loading={loading} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
