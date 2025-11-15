"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CustomerTablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
}

export function CustomerTablePagination({ currentPage, totalPages, totalItems, startIndex, endIndex, onPageChange }: CustomerTablePaginationProps) {
  const visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1).filter((page) => {
    const distance = Math.abs(page - currentPage);
    return distance === 0 || distance === 1 || page === 1 || page === totalPages;
  });

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/30">
      <div className="text-sm text-muted-foreground">
        Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} customers
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="gap-1">
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex items-center gap-1">
          {visiblePages.map((page, index, array) => {
            const showEllipsis = index > 0 && page - array[index - 1] > 1;
            return (
              <div key={page} className="flex items-center">
                {showEllipsis && <span className="px-2 text-muted-foreground">...</span>}
                <Button variant={currentPage === page ? "default" : "ghost"} size="sm" onClick={() => onPageChange(page)} className="w-9 h-9 p-0">
                  {page}
                </Button>
              </div>
            );
          })}
        </div>

        <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="gap-1">
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
