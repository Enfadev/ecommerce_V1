"use client";

import { useState } from 'react';
import { Download, FileText, Table as TableIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ExportButtonProps {
  data: Record<string, unknown>[];
  filename: string;
  type: 'products' | 'orders' | 'customers' | 'inventory' | 'analytics';
  className?: string;
}

export function AdminExportButton({ data, filename, type, className = "" }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const formatProductsForExport = (products: Record<string, unknown>[]) => {
    return products.map(product => ({
      ID: product.id,
      Name: product.name,
      Description: product.description || '',
      Price: product.price,
      'Discount Price': product.hargaDiskon || '',
      Stock: product.stock || 0,
      SKU: product.sku || '',
      Brand: product.brand || '',
      Category: product.category || '',
      Status: product.status || 'active',
      'Created At': product.createdAt ? new Date(product.createdAt as string).toLocaleDateString() : '',
      'Updated At': product.updatedAt ? new Date(product.updatedAt as string).toLocaleDateString() : ''
    }));
  };

  const formatOrdersForExport = (orders: Record<string, unknown>[]) => {
    return orders.map(order => ({
      'Order Number': order.orderNumber,
      'Customer ID': order.userId,
      'Customer Name': (order.user as Record<string, unknown>)?.name || '',
      'Customer Email': (order.user as Record<string, unknown>)?.email || '',
      Status: order.status,
      'Total Amount': order.totalAmount,
      'Shipping Address': order.shippingAddress,
      'Payment Method': order.paymentMethod,
      'Payment Status': order.paymentStatus,
      'Order Date': new Date(order.createdAt as string).toLocaleDateString(),
      'Items Count': (order.items as unknown[])?.length || 0
    }));
  };

  const formatCustomersForExport = (customers: Record<string, unknown>[]) => {
    return customers.map(customer => ({
      ID: customer.id,
      Name: customer.name || '',
      Email: customer.email,
      'Phone Number': customer.phoneNumber || '',
      Address: customer.address || '',
      'Date of Birth': customer.dateOfBirth || '',
      Role: customer.role,
      'Email Verified': customer.emailVerified ? 'Yes' : 'No',
      'Total Orders': (customer._count as Record<string, unknown>)?.orders || 0,
      'Joined Date': new Date(customer.createdAt as string).toLocaleDateString()
    }));
  };

  const formatInventoryForExport = (inventory: Record<string, unknown>[]) => {
    return inventory.map(item => ({
      'Product ID': item.id,
      'Product Name': item.name,
      SKU: item.sku || '',
      'Current Stock': item.stock || 0,
      'Stock Status': (item.stock as number) > 10 ? 'In Stock' : (item.stock as number) > 0 ? 'Low Stock' : 'Out of Stock',
      Price: item.price,
      'Last Updated': item.updatedAt ? new Date(item.updatedAt as string).toLocaleDateString() : ''
    }));
  };

  const formatAnalyticsForExport = (analytics: Record<string, unknown>[]) => {
    return analytics.map(item => ({
      Date: item.date || new Date().toLocaleDateString(),
      'Total Sales': item.totalSales || 0,
      'Total Orders': item.totalOrders || 0,
      'New Customers': item.newCustomers || 0,
      'Revenue': item.revenue || 0,
      'Top Product': item.topProduct || '',
      'Conversion Rate': item.conversionRate || '0%'
    }));
  };

  const formatDataForExport = (data: Record<string, unknown>[], type: string) => {
    switch (type) {
      case 'products':
        return formatProductsForExport(data);
      case 'orders':
        return formatOrdersForExport(data);
      case 'customers':
        return formatCustomersForExport(data);
      case 'inventory':
        return formatInventoryForExport(data);
      case 'analytics':
        return formatAnalyticsForExport(data);
      default:
        return data;
    }
  };

  const exportToCSV = async (format: 'csv' | 'json') => {
    if (data.length === 0) {
      alert('No data available to export');
      return;
    }

    setIsExporting(true);

    try {
      const formattedData = formatDataForExport(data, type);

      if (format === 'csv') {
        const headers = Object.keys(formattedData[0]);
        const csvContent = [
          headers.join(','),
          ...formattedData.map(row =>
            headers.map(header => {
              const value = (row as Record<string, unknown>)[header];
              if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
              }
              return value;
            }).join(',')
          )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (format === 'json') {
        const jsonContent = JSON.stringify(formattedData, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      console.log(`Exported ${formattedData.length} records as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className} disabled={isExporting || data.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => exportToCSV('csv')}>
          <TableIcon className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToCSV('json')}>
          <FileText className="h-4 w-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
