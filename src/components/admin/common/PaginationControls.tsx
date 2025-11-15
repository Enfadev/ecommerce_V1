"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PaginationControlsProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  loading?: boolean;
  showInfo?: boolean;
}

export function PaginationControls({ pagination, onPageChange, loading = false, showInfo = true }: PaginationControlsProps) {
  if (pagination.totalPages <= 1) return null;

  const startItem = (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(pagination.page * pagination.limit, pagination.total);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (pagination.totalPages <= maxVisible) {
      return Array.from({ length: pagination.totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    const start = Math.max(2, pagination.page - 1);
    const end = Math.min(pagination.totalPages - 1, pagination.page + 1);

    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < pagination.totalPages - 1) pages.push("...");

    pages.push(pagination.totalPages);

    return pages;
  };

  return (
    <div className="flex items-center justify-between">
      {showInfo && (
        <div className="text-sm text-muted-foreground">
          Showing {startItem} to {endItem} of {pagination.total} items
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onPageChange(pagination.page - 1)} disabled={pagination.page <= 1 || loading}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                  ...
                </span>
              );
            }

            return (
              <Button key={page} variant={pagination.page === page ? "default" : "ghost"} size="sm" onClick={() => onPageChange(page as number)} className="w-9 h-9 p-0" disabled={loading}>
                {page}
              </Button>
            );
          })}
        </div>

        <div className="sm:hidden text-sm font-medium">
          Page {pagination.page} of {pagination.totalPages}
        </div>

        <Button variant="outline" size="sm" onClick={() => onPageChange(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages || loading}>
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
