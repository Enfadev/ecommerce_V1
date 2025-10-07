# Customer Chat System with Product Sharing

## Overview

Sistem chat real-time antara customer dan admin dengan fitur berbagi produk, mirip dengan Tokopedia. Customer dapat mengajukan pertanyaan dan berbagi produk yang ingin ditanyakan, sementara admin dapat merespons dan memberikan informasi produk.

## Features

### 1. Real-time Chat
- **Server-Sent Events (SSE)** untuk komunikasi real-time
- **Chat widget** yang dapat dibuka/tutup untuk customer
- **Admin dashboard** untuk mengelola semua percakapan
- **Typing indicators** untuk menunjukkan status mengetik
- **Unread message counter** untuk notifikasi

### 2. Product Sharing
- **Product search dialog** dalam chat
- **Product message cards** dengan informasi lengkap
- **Add to cart** langsung dari chat
- **Add to wishlist** langsung dari chat
- **View product details** dengan link baru

### 3. Chat Management
- **Status management**: Open, Closed, Resolved
- **Priority levels**: Low, Normal, High, Urgent
- **Admin assignment** otomatis saat reply
- **Message history** dengan pagination
- **Search & filter** chat rooms

## Database Schema

### ChatRoom
```sql
- id: Primary key
- userId: Customer ID
- adminId: Admin ID (optional, assigned when admin replies)
- status: OPEN, CLOSED, RESOLVED
- subject: Chat topic
- priority: LOW, NORMAL, HIGH, URGENT
- lastMessage: Last message preview
- lastActivity: Timestamp for sorting
- isRead: Read status for notifications
```

### ChatMessage
```sql
- id: Primary key
- chatRoomId: Reference to chat room
- senderId: User ID (customer or admin)
- message: Message content
- messageType: TEXT, IMAGE, FILE, PRODUCT
- productId: Product reference (optional, for PRODUCT type)
- isRead: Read status
- createdAt: Message timestamp
```

## API Endpoints

### Chat Rooms
- `GET /api/chat/rooms` - List chat rooms
- `POST /api/chat/rooms` - Create new chat room

### Chat Messages
- `GET /api/chat/rooms/[roomId]` - Get messages in room
- `POST /api/chat/rooms/[roomId]` - Send message
- `PATCH /api/chat/rooms/[roomId]/manage` - Update room status/priority

### Real-time
- `GET /api/chat/sse` - Server-Sent Events connection

### Product Search
- `GET /api/chat/products/search` - Search products for sharing

## Components

### For Customers
- **ChatWidget**: Floating chat widget
- **ProductSearchDialog**: Product search and selection
- **ProductMessage**: Display shared products

### For Admins
- **AdminChatDashboard**: Complete chat management interface
- **Chat room list** with filters and search
- **Message conversation** view
- **Status and priority** management

## Usage

### Customer Flow
1. Click chat widget button (bottom right)
2. Start new conversation or continue existing
3. Type messages or share products
4. Use product search to find and share items
5. Add products to cart/wishlist directly from chat

### Admin Flow
1. Access admin chat dashboard
2. View all chat rooms with filters
3. Click room to view conversation
4. Reply to customers
5. Manage chat status and priority
6. Share products to help customers

### Product Sharing Flow
1. Click product icon (📦) in chat input
2. Search products by name, brand, or SKU
3. Select product from search results
4. Product card appears in chat
5. Recipient can interact with product (add to cart, view details)

## Message Types

### TEXT Message
Standard text messages between users.

### PRODUCT Message
Special message type that includes:
- Product information card
- Interactive buttons (Add to Cart, Wishlist, View Details)
- Product image and pricing
- Stock status and category

## Real-time Features

### Server-Sent Events (SSE)
- **Connection**: Each user connects to SSE endpoint with room ID
- **Message broadcasting**: New messages sent to all room participants
- **Typing indicators**: Show when someone is typing
- **Connection management**: Automatic cleanup on disconnect

### Notifications
- **Unread counter**: Shows number of unread messages
- **Visual indicators**: Highlight unread chats in admin dashboard
- **Real-time updates**: Instant notification of new messages

## Security

### Authentication
- JWT token verification for all chat endpoints
- Role-based access (customers can only access their chats)
- Admin access control for management features

### Data Protection
- Chat rooms isolated by user ID
- Admin access requires ADMIN role
- Secure product sharing (no sensitive data)

## Installation & Setup

### 1. Database Migration
```bash
npx prisma db push
npx prisma generate
```

### 2. Environment Variables
No additional environment variables needed (uses existing auth system).

### 3. Integration
The chat system is automatically integrated:
- **Customer layout**: ChatWidget added to all customer pages
- **Admin dashboard**: Chat management accessible at `/admin/chat`
- **Product integration**: Uses existing product API

## Technical Implementation

### State Management
- React hooks for local state
- SSE for real-time updates
- Optimistic UI updates for better UX

### Performance
- **Pagination**: Messages loaded in chunks of 50
- **Lazy loading**: Products loaded on demand
- **Connection pooling**: Efficient SSE connection management

### Error Handling
- **Graceful degradation**: Works without real-time features
- **Retry mechanisms**: Automatic reconnection for SSE
- **User feedback**: Clear error messages for failures

## Future Enhancements

### Planned Features
- **File upload**: Share images and documents
- **Voice messages**: Audio message support
- **Chat templates**: Quick response templates for admins
- **Analytics**: Chat performance metrics
- **Mobile app**: Native mobile chat interface

### Potential Improvements
- **Push notifications**: Browser/mobile notifications
- **Chatbot integration**: AI-powered first response
- **Video calls**: Screen sharing for product demos
- **Multi-language**: Internationalization support

## Testing

### Manual Testing
1. **Customer chat**: Create chat, send messages, share products
2. **Admin response**: Reply to customer, manage status
3. **Real-time**: Test multiple users, typing indicators
4. **Product interaction**: Add to cart, view details from chat

### Test Scenarios
- Multiple concurrent users
- Product sharing with different product types
- Admin assignment and status changes
- SSE connection stability
- Mobile responsiveness

## Troubleshooting

### Common Issues
1. **SSE not working**: Check browser compatibility, network issues
2. **Products not loading**: Verify product API, check permissions
3. **Messages not sending**: Check authentication, network connectivity
4. **Admin can't see chats**: Verify ADMIN role, refresh permissions

### Debug Tips
- Check browser console for SSE errors
- Verify JWT token validity
- Test API endpoints directly
- Check database connections

## Conclusion

The customer chat system with product sharing provides a complete e-commerce communication solution. It enables seamless interaction between customers and admins while facilitating product discovery and sales through integrated chat commerce features.
