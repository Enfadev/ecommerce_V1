# Test Script untuk Unread Badge Realtime

## Langkah Testing:

### 1. **Persiapan**
- Buka admin panel di browser utama: `http://localhost:3000/admin`
- Buka customer page di browser/tab lain: `http://localhost:3000`
- Pastikan debug info muncul di pojok kanan bawah admin panel

### 2. **Test Unread Badge Realtime**

#### Step 1: Cek Initial State
- [ ] Badge chat di sidebar admin menunjukkan count yang benar
- [ ] Debug info menunjukkan SSE status "connected"
- [ ] Console browser admin menunjukkan log SSE connection

#### Step 2: Kirim Chat dari Customer
- [ ] Buka customer chat widget
- [ ] Kirim pesan: "Test message 1"
- [ ] **EXPECTED**: Badge admin sidebar langsung bertambah (+1) tanpa refresh
- [ ] **EXPECTED**: Debug info menunjukkan last update time berubah

#### Step 3: Test Multiple Messages
- [ ] Kirim beberapa pesan lagi dari customer
- [ ] **EXPECTED**: Badge count terus bertambah realtime
- [ ] **EXPECTED**: Console admin menunjukkan log SSE messages

#### Step 4: Test Browser Baru (Masalah Utama)
- [ ] Buka tab/browser admin baru: `http://localhost:3000/admin`
- [ ] **EXPECTED**: Unread count TIDAK menghilang
- [ ] **EXPECTED**: Badge tetap menunjukkan jumlah yang sama
- [ ] **EXPECTED**: SSE connection setup di browser baru

#### Step 5: Test Mark as Read
- [ ] Di admin, klik chat room yang ada unread messages
- [ ] **EXPECTED**: Badge berkurang sesuai unread count room tersebut
- [ ] **EXPECTED**: Debug info update

### 3. **Console Logs yang Harus Terlihat**

#### Admin Browser Console:
```
🔗 Sidebar: Setting up global SSE for total unread count
✅ Sidebar: Global SSE connection opened for user 1
📊 Sidebar: Fetching unread count...
📊 Sidebar: Total unread count: X
📨 Sidebar: Global SSE message received for user 1: {...}
📨 Sidebar: New message in room X, updating total count
📨 Sidebar: Total unread count updated from X to Y
```

#### Customer Browser Console:
```
📨 User: Chat state - isOpen: true, isMinimized: false
🔗 User: Setting up SSE for room X
✅ User: SSE connection opened for room X
```

#### Server Console:
```
SSE: Establishing global connection for user 1
📡 Broadcasting to room X: {...}
📡 Sent to global connection: 1-global
📡 Broadcasted to Y room connections and Z global connections for room X
```

### 4. **Manual Fallback Test**
- [ ] Jika SSE gagal, badge harus update setiap 15 detik (backup polling)
- [ ] Debug component manual refresh button berfungsi
- [ ] Window global refresh function tersedia

### 5. **Multi-browser Persistence Test**
- [ ] Buka 3 browser admin berbeda
- [ ] Kirim chat dari customer
- [ ] **EXPECTED**: Semua browser admin mendapat update realtime
- [ ] **EXPECTED**: Unread count konsisten di semua browser

## Troubleshooting:

### Jika Badge Tidak Update Realtime:
1. Check console untuk error SSE
2. Verify SSE connection di debug info  
3. Check server logs untuk broadcast
4. Test manual refresh button

### Jika Unread Count Menghilang:
1. Pastikan tidak ada auto mark-as-read di GET messages
2. Check database untuk isRead status
3. Verify API /api/chat/rooms response

### Jika SSE Error:
1. Check JWT token validity
2. Verify server SSE endpoint
3. Check network/firewall issues
4. Fallback ke polling backup

## Expected Behavior:
✅ **SEBELUM**: Badge hanya update setelah refresh manual
✅ **SESUDAH**: Badge update realtime tanpa refresh
✅ **SEBELUM**: Unread count menghilang di browser baru  
✅ **SESUDAH**: Unread count persistent di semua browser
