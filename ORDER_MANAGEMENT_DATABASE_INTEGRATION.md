# Order Management Database Integration

## Overview
Order Management kini telah diintegrasikan dengan database untuk mengambil dan mengelola data order secara real-time. Fitur ini menggantikan data mock yang sebelumnya digunakan.

## Features Implemented

### 1. API Endpoints (`/api/admin/orders`)
- **GET**: Mengambil daftar order dengan fitur:
  - Pagination (page, limit)
  - Filter berdasarkan status order
  - Search berdasarkan order number, nama customer, atau email
  - Statistik order (total, pending, processing, shipped, delivered, cancelled, revenue)
  
- **PATCH**: Update status order dan payment status

### 2. Database Models Used
- **Order**: Model utama untuk menyimpan data order
- **OrderItem**: Model untuk item dalam order
- **User**: Model customer yang membuat order  
- **Product**: Model produk yang dipesan

### 3. React Hook (`useOrders`)
Custom hook yang menyediakan:
- State management untuk orders, stats, loading, error
- Function `fetchOrders()` untuk mengambil data dengan parameter
- Function `updateOrder()` untuk update status order
- Automatic error handling dan loading states

### 4. Updated UI Component (`AdminOrderManagement`)
- Real-time data dari database
- Search dan filter functionality
- Pagination untuk large datasets
- Loading states dan error handling
- Update order status langsung dari UI
- Order detail modal dengan informasi lengkap

## Database Schema Changes

### Order Table
```sql
model Order {
  id              Int       @id @default(autoincrement())
  orderNumber     String    @unique
  userId          Int
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  items           OrderItem[]
  status          OrderStatus @default(PENDING)
  
  // Customer Information
  customerName    String
  customerEmail   String
  customerPhone   String
  shippingAddress String
  postalCode      String?
  notes           String?
  
  // Payment Information
  paymentMethod   String    @default("Bank Transfer")
  paymentStatus   PaymentStatus @default(PENDING)
  paymentProof    String?
  
  // Price Information
  subtotal        Float
  shippingFee     Float     @default(0)
  tax             Float     @default(0)
  discount        Float     @default(0)
  totalAmount     Float
  
  // Shipping Information
  trackingNumber  String?
  estimatedDelivery DateTime?
  
  // Timestamps
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

### OrderItem Table
```sql
model OrderItem {
  id        Int     @id @default(autoincrement())
  orderId   Int
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId Int
  product   Product @relation(fields: [productId], references: [id])
  
  // Product snapshot at time of purchase
  productName     String
  productPrice    Float
  productImage    String?
  quantity        Int
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([orderId, productId])
}
```

## Status Enums

### OrderStatus
- PENDING
- CONFIRMED  
- PROCESSING
- SHIPPED
- DELIVERED
- CANCELLED
- RETURNED

### PaymentStatus
- PENDING
- PAID
- FAILED
- REFUNDED

## Sample Data
Script `prisma/seed-orders.js` telah dibuat untuk mengisi database dengan sample data order untuk testing.

## Usage

### 1. Start Development Server
```bash
npm run dev
```

### 2. Seed Sample Data (Optional)
```bash
node prisma/seed-orders.js
```

### 3. Access Admin Panel
Navigate to `/admin` dan pilih "Orders" dari sidebar untuk melihat Order Management yang telah diintegrasikan dengan database.

## API Usage Examples

### Get Orders with Pagination and Filter
```javascript
GET /api/admin/orders?page=1&limit=10&status=pending&search=john

Response:
{
  "orders": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  },
  "stats": {
    "total": 50,
    "pending": 10,
    "processing": 5,
    "shipped": 15,
    "delivered": 18,
    "cancelled": 2,
    "revenue": 12500.00
  }
}
```

### Update Order Status
```javascript
PATCH /api/admin/orders
{
  "orderNumber": "ORD-001",
  "status": "shipped",
  "trackingNumber": "TRK12345"
}
```

## Error Handling
- API errors are properly handled dan ditampilkan di UI
- Loading states ditampilkan selama data fetch
- Retry functionality untuk failed requests
- Input validation untuk update operations

## Security Considerations
- API endpoints should be protected dengan authentication middleware (belum diimplementasikan)
- Input sanitization untuk search queries
- Proper error messages yang tidak mengexpose sensitive information

## Future Enhancements
1. Add authentication middleware untuk API endpoints
2. Implement real-time updates dengan WebSocket atau Server-Sent Events
3. Add export functionality untuk order data
4. Implement advanced filtering (date range, price range, etc.)
5. Add bulk operations untuk multiple orders
6. Email notifications untuk status changes
