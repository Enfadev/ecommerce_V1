# Chat System Implementation

## Overview

Sistem chat real-time telah diimplementasikan untuk memungkinkan komunikasi antara customer dan admin. Fitur ini menggunakan Server-Sent Events (SSE) untuk komunikasi real-time dan terintegrasi dengan sistem autentikasi yang sudah ada.

## Features

### Customer Features
- **Chat Widget**: Widget chat floating di pojok kanan bawah pada halaman customer
- **Real-time Messaging**: Pesan real-time menggunakan SSE
- **Message History**: Riwayat percakapan dengan admin
- **Auto-connect**: Otomatis terhubung ke chat room yang sudah ada atau membuat baru
- **Typing Indicator**: Indikator ketika admin sedang mengetik
- **Unread Badge**: Badge notifikasi untuk pesan yang belum dibaca

### Admin Features
- **Chat Dashboard**: Panel admin untuk mengelola semua percakapan
- **Multiple Chat Rooms**: Mengelola beberapa percakapan customer sekaligus
- **Chat Status Management**: Mengubah status chat (OPEN, CLOSED, RESOLVED)
- **Priority System**: Mengatur prioritas chat (LOW, NORMAL, HIGH, URGENT)
- **Real-time Updates**: Update real-time untuk pesan baru dan status chat
- **Filter & Search**: Filter berdasarkan status, prioritas, dan pencarian customer
- **Statistics**: Dashboard dengan statistik chat (total, open, closed, resolved, unread)

## Database Schema

### ChatRoom Model
```prisma
model ChatRoom {
  id           Int           @id @default(autoincrement())
  userId       Int           // Customer ID
  user         User          @relation(fields: [userId], references: [id])
  adminId      Int?          // Admin ID yang handle chat
  admin        User?         @relation("AdminChats", fields: [adminId], references: [id])
  status       ChatStatus    @default(OPEN)
  subject      String?       // Subjek chat
  priority     ChatPriority  @default(NORMAL)
  lastMessage  String?       // Preview pesan terakhir
  lastActivity DateTime      @default(now())
  isRead       Boolean       @default(false)
  messages     ChatMessage[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}
```

### ChatMessage Model
```prisma
model ChatMessage {
  id         Int      @id @default(autoincrement())
  chatRoomId Int
  chatRoom   ChatRoom @relation(fields: [chatRoomId], references: [id])
  senderId   Int      // User ID pengirim (bisa customer atau admin)
  sender     User     @relation("SentMessages", fields: [senderId], references: [id])
  message    String   @db.Text
  messageType MessageType @default(TEXT)
  isRead     Boolean  @default(false)
  createdAt  DateTime @default(now())
}
```

### Enums
```prisma
enum ChatStatus {
  OPEN      // Chat aktif
  CLOSED    // Chat ditutup
  RESOLVED  // Chat resolved
}

enum ChatPriority {
  LOW
  NORMAL
  HIGH
  URGENT
}

enum MessageType {
  TEXT      // Pesan teks biasa
  IMAGE     // Gambar (untuk future development)
  FILE      // File attachment (untuk future development)
}
```

## API Endpoints

### GET /api/chat/rooms
- **Description**: Mendapatkan daftar chat rooms
- **Authorization**: Required (Customer mendapat chat miliknya, Admin mendapat semua chat)
- **Response**: Array of chat rooms dengan metadata

### POST /api/chat/rooms
- **Description**: Membuat chat room baru atau menambah pesan ke chat yang sudah ada
- **Authorization**: Required (Customer only)
- **Body**: `{ subject?, message, priority? }`

### GET /api/chat/rooms/[roomId]
- **Description**: Mendapatkan detail chat room dan pesan-pesannya
- **Authorization**: Required (harus pemilik chat atau admin)
- **Response**: Chat room dengan array messages

### POST /api/chat/rooms/[roomId]
- **Description**: Mengirim pesan baru ke chat room
- **Authorization**: Required
- **Body**: `{ message, messageType? }`

### PATCH /api/chat/rooms/[roomId]/manage
- **Description**: Update status atau prioritas chat (Admin only)
- **Authorization**: Admin only
- **Body**: `{ status?, priority?, adminId? }`

### GET /api/chat/sse
- **Description**: Server-Sent Events endpoint untuk real-time messaging
- **Authorization**: Required
- **Query**: `roomId`

## Components

### Customer Components

#### ChatWidget (`/src/components/chat/ChatWidget.tsx`)
- Widget floating chat untuk customer
- Auto-minimizable dan closable
- Form untuk memulai chat baru
- Interface chat dengan real-time messaging
- Typing indicator dan unread counter

### Admin Components

#### AdminChatDashboard (`/src/components/admin/AdminChatDashboard.tsx`)
- Dashboard lengkap untuk admin mengelola chat
- List chat rooms dengan filter dan pencarian
- Chat interface untuk membalas customer
- Status dan priority management
- Statistics cards

## Pages

### Customer Pages
- Chat widget otomatis muncul di semua halaman customer (integrated in customer layout)

### Admin Pages
- `/admin/chat` - Admin chat dashboard

## Real-time Communication

### Server-Sent Events (SSE)
- Endpoint: `/api/chat/sse?roomId={id}`
- Event types:
  - `connected`: Konfirmasi koneksi berhasil
  - `message`: Pesan baru diterima
  - `typing`: Indikator typing (future development)

### Usage in Components
```typescript
const eventSource = new EventSource(`/api/chat/sse?roomId=${roomId}`);

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case "message":
      setMessages(prev => [...prev, data.data]);
      break;
    case "typing":
      setIsTyping(data.data.isTyping);
      break;
  }
};
```

## Integration Points

### Authentication
- Menggunakan sistem auth yang sudah ada (`getUserFromRequest`)
- Terintegrasi dengan role-based access (USER/ADMIN)
- JWT token dan NextAuth support

### Navigation
- Admin sidebar updated dengan menu "Chat Support"
- Auto-navigation antar status chat

### Database
- Menggunakan Prisma client yang sudah ada
- Migration file untuk chat tables
- Relasi dengan User model yang sudah ada

## Deployment Notes

### Database Migration
```bash
npx prisma db push
npx prisma generate
```

### Environment Variables
No additional environment variables required - menggunakan DATABASE_URL yang sudah ada.

## Future Enhancements

1. **File Attachments**: Support untuk upload gambar dan file
2. **Push Notifications**: Browser notifications untuk pesan baru
3. **Chat Templates**: Template balasan cepat untuk admin
4. **Chat Analytics**: Analytics detail percakapan dan response time
5. **Multi-language**: Support multiple bahasa
6. **Voice Messages**: Pesan suara
7. **Chat Bot**: Auto-responder untuk pertanyaan umum
8. **Chat Export**: Export riwayat chat ke PDF/CSV

## Security Considerations

1. **Authorization**: Setiap endpoint menggunakan authorization check
2. **Data Isolation**: User hanya bisa akses chat miliknya sendiri
3. **Admin Privileges**: Admin memiliki akses penuh dengan logging
4. **Rate Limiting**: Bisa ditambahkan rate limiting untuk prevent spam
5. **Input Validation**: Semua input divalidasi sebelum disimpan

## Testing

### Manual Testing Steps

1. **Customer Flow**:
   - Login sebagai customer
   - Klik chat widget di pojok kanan bawah
   - Isi form untuk mulai chat baru
   - Kirim beberapa pesan
   - Verify real-time updates

2. **Admin Flow**:
   - Login sebagai admin
   - Navigate ke `/admin/chat`
   - Lihat daftar chat rooms
   - Pilih chat room dan balas pesan
   - Update status dan priority chat
   - Verify real-time updates

3. **Real-time Testing**:
   - Buka 2 browser (satu customer, satu admin)
   - Mulai percakapan dan verify pesan muncul real-time
   - Test typing indicators (jika sudah diimplementasi)

## Performance Considerations

1. **SSE Connections**: Monitor jumlah koneksi SSE aktif
2. **Database Queries**: Optimize query dengan proper indexing
3. **Message Pagination**: Implement pagination untuk chat history
4. **Connection Cleanup**: Ensure SSE connections closed properly
5. **Caching**: Consider caching untuk frequently accessed data

## Support

Untuk pertanyaan teknis atau bug reports, silakan hubungi development team atau buat issue di repository project ini.
