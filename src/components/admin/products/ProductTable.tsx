import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Package, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DiscountDisplay } from "@/components/admin/shared/DiscountDisplay";
import type { Product } from "@/hooks/use-products";

interface ProductTableProps {
  products: Product[];
  visibleColumns: string[];
  allColumns: Array<{ key: string; label: string }>;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number, currentStatus: string) => void;
}

export function ProductTable({ products, visibleColumns, allColumns, onEdit, onDelete, onToggleStatus }: ProductTableProps) {
  const getStatusColor = (status: string, stock: number) => {
    if (stock === 0) return "bg-red-500/10 text-red-500 border-red-500/20";
    if (stock < 10) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    return "bg-green-500/10 text-green-500 border-green-500/20";
  };

  const getStatusText = (status: string, stock: number) => {
    if (stock === 0) return "Out of Stock";
    if (stock < 10) return "Low Stock";
    return "Available";
  };

  return (
    <Card>
      <div className="overflow-x-auto border rounded-lg custom-scrollbar">
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            height: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: hsl(var(--muted));
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: hsl(var(--border));
            border-radius: 3px;
            transition: background-color 0.2s ease;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: hsl(var(--muted-foreground) / 0.4);
          }
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: hsl(var(--border)) hsl(var(--muted));
          }
        `}</style>
        <div className="min-w-fit">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-12 text-center sticky left-0 bg-muted/30 z-10 border-r shadow-sm">#</TableHead>
                {allColumns.map(
                  (col) =>
                    visibleColumns.includes(col.key) && (
                      <TableHead key={col.key} className="text-center whitespace-nowrap min-w-[160px] px-4 py-3">
                        {col.label}
                      </TableHead>
                    )
                )}
                <TableHead className="w-24 text-center sticky right-0 bg-muted/30 z-10 border-l shadow-sm">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product.id} className="hover:bg-muted/20">
                  <TableCell className="text-center sticky left-0 bg-background z-10 border-r font-medium shadow-sm">{index + 1}</TableCell>
                  {allColumns.map(
                    (col) =>
                      visibleColumns.includes(col.key) && (
                        <TableCell key={col.key} className="text-center whitespace-nowrap min-w-[160px] px-4 py-4">
                          {col.key === "imageUrl" ? (
                            product.imageUrl ? (
                              <div className="flex justify-center">
                                <Image src={product.imageUrl} alt={product.name} width={64} height={64} className="object-cover rounded-lg border" />
                              </div>
                            ) : (
                              <div className="flex justify-center">
                                <Package className="w-8 h-8 text-muted-foreground" />
                              </div>
                            )
                          ) : col.key === "gallery" ? (
                            product.gallery && product.gallery.length > 0 ? (
                              <div className="flex gap-2 flex-wrap justify-center max-w-[140px] mx-auto">
                                {product.gallery.slice(0, 3).map((url, idx) => (
                                  <Image key={idx} src={url} alt={`Gallery ${idx + 1}`} width={32} height={32} className="object-cover rounded border" />
                                ))}
                                {product.gallery.length > 3 && <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-xs font-medium border">+{product.gallery.length - 3}</div>}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )
                          ) : col.key === "price" ? (
                            <DiscountDisplay originalPrice={product.price} discountPrice={product.discountPrice} promoExpired={product.promoExpired} compact={true} showExpiry={false} />
                          ) : col.key === "discountPrice" ? (
                            product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price && (!product.promoExpired || new Date(product.promoExpired) > new Date()) ? (
                              <div className="space-y-1">
                                <Badge variant="destructive" className="text-xs">
                                  -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                                </Badge>
                                <div className="text-xs text-muted-foreground">${(product.price - product.discountPrice).toFixed(2)} saved</div>
                                {product.promoExpired && <div className="text-xs text-orange-600">Expires: {new Date(product.promoExpired).toLocaleDateString()}</div>}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">No discount</span>
                            )
                          ) : col.key === "createdAt" || col.key === "updatedAt" ? (
                            product[col.key as keyof Product] ? (
                              <span className="text-sm font-medium">{new Date(product[col.key as keyof Product] as string).toLocaleDateString()}</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )
                          ) : col.key === "status" ? (
                            <Badge variant="outline" className={`${getStatusColor(product.status || "", product.stock || 0)} px-3 py-1 font-medium`}>
                              {getStatusText(product.status || "", product.stock || 0)}
                            </Badge>
                          ) : col.key === "stock" ? (
                            <span className={`font-bold text-base ${(product.stock || 0) === 0 ? "text-red-500" : (product.stock || 0) < 10 ? "text-yellow-600" : "text-green-600"}`}>{product.stock || 0}</span>
                          ) : col.key === "name" ? (
                            <span className="max-w-[140px] truncate block font-medium text-sm" title={String(product[col.key as keyof Product] || "-")}>
                              {product[col.key as keyof Product] || <span className="text-muted-foreground">-</span>}
                            </span>
                          ) : (
                            <span className="max-w-[140px] truncate block text-sm" title={String(product[col.key as keyof Product] || "-")}>
                              {product[col.key as keyof Product] || <span className="text-muted-foreground">-</span>}
                            </span>
                          )}
                        </TableCell>
                      )
                  )}
                  <TableCell className="text-center sticky right-0 bg-background z-10 border-l shadow-sm">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Action</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(product)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onToggleStatus(product.id, product.status || "active")} className={product.status === "active" ? "text-yellow-600" : "text-green-600"}>
                          <Package className="w-4 h-4 mr-2" />
                          {product.status === "active" ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(product.id)} className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {visibleColumns.length > 8 && (
        <div className="p-2 text-center text-sm text-muted-foreground bg-muted/20 border-t">
          <p>💡 Tip: Scroll horizontally to view all {visibleColumns.length} columns. Use the Columns button to hide unnecessary fields.</p>
        </div>
      )}
    </Card>
  );
}
