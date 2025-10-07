# Fix: Cart API Compatibility with Google OAuth

## Masalah yang Diperbaiki

Saat login menggunakan Google OAuth, muncul error "Failed to fetch cart" karena API cart endpoint hanya mendukung autentikasi JWT token, sedangkan Google OAuth menggunakan NextAuth session.

## Perubahan yang Dilakukan

### 1. Created Auth Utility Helper

**File:** `src/lib/auth-utils.ts`

Membuat helper function `getUserIdFromRequest()` yang mendukung:
- NextAuth session (prioritas utama)
- JWT token (fallback untuk login reguler)

### 2. Updated Cart API Endpoints

**Files Updated:**
- `src/app/api/cart/route.ts` - Main cart operations
- `src/app/api/cart/[id]/route.ts` - Individual cart item operations  
- `src/app/api/cart/bulk/route.ts` - Bulk cart operations

**Changes:**
- Replaced JWT-only authentication with hybrid authentication
- Support both NextAuth sessions and JWT tokens
- Consistent user ID extraction across all endpoints

### 3. Authentication Flow

**Before:**
```
Login with Google → NextAuth Session → Cart API (JWT only) → ❌ Failed
```

**After:**
```
Login with Google → NextAuth Session → Cart API (Hybrid Auth) → ✅ Success
Login with Email/Password → JWT Token → Cart API (Hybrid Auth) → ✅ Success
```

## How It Works

1. **Primary Check**: Cart API first checks for NextAuth session
2. **Fallback Check**: If no NextAuth session, checks for JWT token
3. **User ID Extraction**: Gets user ID from either authentication method
4. **Cart Operations**: Proceed with normal cart operations

## Benefits

- ✅ **Google OAuth Compatible**: Cart works with Google login
- ✅ **Backward Compatible**: Regular email/password login still works
- ✅ **Unified Experience**: Same cart functionality for all users
- ✅ **Error-Free**: No more "Failed to fetch cart" errors

## Testing

1. Login with Google → Cart should load successfully
2. Login with email/password → Cart should continue working
3. Add/remove items → Should work for both authentication methods
4. Logout and login again → Cart persists correctly

## Code Changes Summary

```typescript
// Before: JWT only
const token = request.cookies.get("auth-token")?.value;
const payload = await verifyJWT(token);

// After: Hybrid authentication
const userId = await getUserIdFromRequest(request);
// Supports both NextAuth and JWT
```

This fix ensures seamless cart functionality regardless of login method.
