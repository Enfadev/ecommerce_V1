import React from 'react';
import { Order } from '@/hooks/use-orders';

interface InvoiceProps {
  order: Order;
  companyInfo?: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
  };
}

export const Invoice: React.FC<InvoiceProps> = ({ 
  order, 
  companyInfo = {
    name: "Your Company Name",
    address: "123 Business Street, City, State 12345",
    phone: "+1 (555) 123-4567",
    email: "info@yourcompany.com",
    website: "www.yourcompany.com"
  }
}) => {
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="invoice-container bg-white text-black p-8 max-w-4xl mx-auto print:shadow-none print:p-6">
      {/* Invoice Header */}
      <div className="border-b-2 border-gray-300 pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">INVOICE</h1>
            <p className="text-gray-600">Invoice #{order.orderNumber}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{companyInfo.name}</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p>{companyInfo.address}</p>
              <p>{companyInfo.phone}</p>
              <p>{companyInfo.email}</p>
              {companyInfo.website && <p>{companyInfo.website}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Info */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Bill To:</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <p className="font-medium">{order.customerName}</p>
            <p>{order.customerEmail}</p>
            <p>{order.customerPhone}</p>
            <p className="mt-2">{order.shippingAddress}</p>
            {order.postalCode && <p>{order.postalCode}</p>}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Invoice Details:</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <div className="flex justify-between">
              <span>Invoice Date:</span>
              <span className="font-medium">{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span>Order Status:</span>
              <span className="font-medium capitalize">{order.status.toLowerCase()}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span className="font-medium">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Status:</span>
              <span className="font-medium capitalize">{order.paymentStatus.toLowerCase()}</span>
            </div>
            {order.trackingNumber && (
              <div className="flex justify-between">
                <span>Tracking Number:</span>
                <span className="font-medium">{order.trackingNumber}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">Item</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-800">Quantity</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-800">Unit Price</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-800">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-800">{item.productName}</div>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700">{item.quantity}</td>
                  <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(item.productPrice)}</td>
                  <td className="py-3 px-4 text-right font-medium text-gray-800">
                    {formatCurrency(item.productPrice * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="flex justify-end">
        <div className="w-80">
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-800">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping Fee:</span>
                <span className="text-gray-800">{formatCurrency(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span className="text-gray-800">{formatCurrency(order.tax)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount:</span>
                  <span className="text-green-600">-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="border-t border-gray-300 pt-2 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
                  <span className="text-xl font-bold text-gray-800">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="mt-8 p-4 bg-gray-50 border border-gray-300 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Notes:</h3>
          <p className="text-sm text-gray-700">{order.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-600">
        <p>Thank you for your business!</p>
        <p className="mt-2">
          If you have any questions about this invoice, please contact us at {companyInfo.email} or {companyInfo.phone}
        </p>
      </div>
    </div>
  );
};
