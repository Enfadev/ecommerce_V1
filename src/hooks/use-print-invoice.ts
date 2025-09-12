import { useCallback, useState } from 'react';
import { Order } from '@/hooks/use-orders';

interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logoUrl?: string;
}

export const usePrintInvoice = () => {
  const [isLoading, setIsLoading] = useState(false);

  const printInvoice = useCallback(async (order: Order, companyInfo?: CompanyInfo) => {
    setIsLoading(true);
    
    try {
      let company = companyInfo;
      if (!company) {
        try {
          const response = await fetch('/api/company');
          if (response.ok) {
            company = await response.json();
          }
        } catch (error) {
          console.warn('Failed to fetch company info, using defaults:', error);
        }
      }

      const currentDomain = typeof window !== 'undefined' 
        ? window.location.host 
        : 'localhost:3000';

      const origin = typeof window !== 'undefined'
        ? window.location.origin
        : 'http://localhost:3000';

      const printWindow = window.open('', '_blank', 'width=800,height=600');
      
      if (!printWindow) {
        throw new Error('Unable to open print window. Please check your popup blocker settings.');
      }

      const defaultCompanyInfo = {
        name: "E-Commerce Store",
        address: "123 Business Street, New York, NY 10001",
        phone: "+1 (555) 123-4567",
        email: "info@ecommerce.com",
        website: currentDomain
      };

      company = company || defaultCompanyInfo;

      company.website = currentDomain;

      const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
      
      const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      };

      const logoUrlFromCompany = company && (company as CompanyInfo).logoUrl;
      const logoSrc = logoUrlFromCompany
        ? (logoUrlFromCompany.startsWith('http') ? logoUrlFromCompany : `${origin}${logoUrlFromCompany.startsWith('/') ? '' : '/'}${logoUrlFromCompany}`)
        : `${origin}/logo.svg`;

      const invoiceHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice #${order.orderNumber}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.4;
              color: #333;
              background: white;
              font-size: 12px;
            }
            
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              background: white;
              min-height: 100vh;
              position: relative;
            }
            
            .invoice-header {
              border-bottom: 2px solid #333;
              padding-bottom: 15px;
              margin-bottom: 20px;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }

            .header-left {
              display: flex;
              align-items: flex-start;
            }

            .company-logo {
              max-height: 60px;
              margin-right: 12px;
            }
            
            .invoice-title {
              font-size: 28px;
              font-weight: bold;
              color: #333;
              margin-bottom: 5px;
            }
            
            .invoice-number {
              color: #666;
              font-size: 14px;
            }
            
            .company-info {
              text-align: right;
            }
            
            .company-name {
              font-size: 20px;
              font-weight: bold;
              color: #333;
              margin-bottom: 8px;
            }
            
            .company-details {
              font-size: 12px;
              color: #666;
              line-height: 1.4;
            }
            
            .invoice-details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-bottom: 20px;
            }
            
            .section-title {
              font-size: 14px;
              font-weight: 600;
              color: #333;
              margin-bottom: 10px;
            }
            
            .detail-item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
              font-size: 12px;
            }
            
            .detail-label {
              color: #666;
            }
            
            .detail-value {
              font-weight: 500;
              color: #333;
            }
            
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
              border: 1px solid #ddd;
              border-radius: 6px;
              overflow: hidden;
              font-size: 12px;
            }
            
            .items-table th {
              background-color: #f8f9fa;
              padding: 8px 6px;
              font-weight: 600;
              color: #333;
              border-bottom: 1px solid #ddd;
            }
            
            .items-table td {
              padding: 8px 6px;
              border-bottom: 1px solid #eee;
            }
            
            .items-table tr:last-child td {
              border-bottom: none;
            }
            
            .items-table tr:nth-child(even) {
              background-color: #f8f9fa;
            }
            
            .text-left { text-align: left; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            
            .payment-summary {
              display: flex;
              justify-content: flex-end;
              margin-bottom: 15px;
            }
            
            .summary-box {
              background-color: #f8f9fa;
              border: 1px solid #ddd;
              border-radius: 6px;
              padding: 15px;
              width: 250px;
            }
            
            .summary-title {
              font-size: 14px;
              font-weight: 600;
              color: #333;
              margin-bottom: 10px;
            }
            
            .summary-item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
              font-size: 12px;
            }
            
            .summary-total {
              border-top: 1px solid #333;
              padding-top: 8px;
              margin-top: 8px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            
            .total-label {
              font-size: 14px;
              font-weight: 600;
              color: #333;
            }
            
            .total-amount {
              font-size: 16px;
              font-weight: bold;
              color: #333;
            }
            
            .notes-section {
              background-color: #f8f9fa;
              border: 1px solid #ddd;
              border-radius: 6px;
              padding: 10px;
              margin-bottom: 15px;
              font-size: 11px;
            }
            
            .notes-title {
              font-size: 12px;
              font-weight: 600;
              color: #333;
              margin-bottom: 5px;
            }
            
            .footer {
              text-align: center;
              padding-top: 15px;
              border-top: 1px solid #ddd;
              color: #666;
              font-size: 11px;
              line-height: 1.3;
              position: absolute;
              bottom: 20px;
              left: 20px;
              right: 20px;
            }
            
            .discount { color: #22c55e; }
            
            .customer-info {
              font-size: 12px;
              line-height: 1.4;
            }
            
            .customer-name {
              font-weight: 600; 
              margin-bottom: 5px;
            }
            
            @media print {
              body { 
                margin: 0;
                font-size: 11px;
              }
              .invoice-container { 
                padding: 15px;
                box-shadow: none;
                min-height: auto;
              }
              .footer {
                position: relative;
                bottom: auto;
                margin-top: 15px;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <!-- Invoice Header -->
            <div class="invoice-header">
              <div class="header-left">
                <img class="company-logo" src="${logoSrc}" alt="${company.name} logo" />
                <div>
                  <h1 class="invoice-title">INVOICE</h1>
                  <p class="invoice-number">Invoice #${order.orderNumber}</p>
                </div>
              </div>
              <div class="company-info">
                <h2 class="company-name">${company.name}</h2>
                <div class="company-details">
                  <div>${company.address}</div>
                  <div>${company.phone}</div>
                  <div>${company.email}</div>
                  ${company.website ? `<div>${company.website}</div>` : ''}
                </div>
              </div>
            </div>

            <!-- Invoice Details -->
            <div class="invoice-details">
              <div>
                <h3 class="section-title">Bill To:</h3>
                <div class="customer-info">
                  <div class="customer-name">${order.customerName}</div>
                  <div style="color: #666;">
                    <div>${order.customerEmail}</div>
                    <div>${order.customerPhone}</div>
                    <div style="margin-top: 5px;">${order.shippingAddress}</div>
                    ${order.postalCode ? `<div>${order.postalCode}</div>` : ''}
                  </div>
                </div>
              </div>
              <div>
                <h3 class="section-title">Invoice Details:</h3>
                <div class="detail-item">
                  <span class="detail-label">Invoice Date:</span>
                  <span class="detail-value">${formatDate(order.createdAt)}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Order Status:</span>
                  <span class="detail-value" style="text-transform: capitalize;">${order.status.toLowerCase()}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Payment Method:</span>
                  <span class="detail-value">${order.paymentMethod}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Payment Status:</span>
                  <span class="detail-value" style="text-transform: capitalize;">${order.paymentStatus.toLowerCase()}</span>
                </div>
                ${order.trackingNumber ? `
                  <div class="detail-item">
                    <span class="detail-label">Tracking Number:</span>
                    <span class="detail-value">${order.trackingNumber}</span>
                  </div>
                ` : ''}
              </div>
            </div>

            <!-- Order Items -->
            <div>
              <h3 class="section-title">Order Items</h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th class="text-left">Item</th>
                    <th class="text-center">Quantity</th>
                    <th class="text-right">Unit Price</th>
                    <th class="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items.map(item => `
                    <tr>
                      <td class="text-left">
                        <div style="font-weight: 500;">${item.productName}</div>
                      </td>
                      <td class="text-center">${item.quantity}</td>
                      <td class="text-right">${formatCurrency(item.productPrice)}</td>
                      <td class="text-right" style="font-weight: 500;">
                        ${formatCurrency(item.productPrice * item.quantity)}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- Payment Summary -->
            <div class="payment-summary">
              <div class="summary-box">
                <h3 class="summary-title">Payment Summary</h3>
                <div class="summary-item">
                  <span>Subtotal:</span>
                  <span>${formatCurrency(order.subtotal)}</span>
                </div>
                <div class="summary-item">
                  <span>Shipping Fee:</span>
                  <span>${formatCurrency(order.shippingFee)}</span>
                </div>
                <div class="summary-item">
                  <span>Tax:</span>
                  <span>${formatCurrency(order.tax)}</span>
                </div>
                ${order.discount > 0 ? `
                  <div class="summary-item">
                    <span>Discount:</span>
                    <span class="discount">-${formatCurrency(order.discount)}</span>
                  </div>
                ` : ''}
                <div class="summary-total">
                  <span class="total-label">Total Amount:</span>
                  <span class="total-amount">${formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            ${order.notes ? `
              <!-- Notes -->
              <div class="notes-section">
                <h3 class="notes-title">Notes:</h3>
                <p>${order.notes}</p>
              </div>
            ` : ''}

            <!-- Footer -->
            <div class="footer">
              <p><strong>Thank you for your business!</strong></p>
              <p style="margin-top: 5px;">
                Questions? Contact us at ${company.email} or ${company.phone}
              </p>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
      
      printWindow.onafterprint = () => {
        printWindow.close();
      };

    } catch (error) {
      console.error('Error printing invoice:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    printInvoice,
    isLoading
  };
};
