# PayPal Testing Guide - Wallet Only

## Masalah: PayPal Masih Meminta Kartu Kredit

Jika PayPal masih meminta informasi kartu kredit setelah login, ini disebabkan oleh:

1. **Insufficient PayPal Balance** - Account sandbox tidak memiliki balance yang cukup
2. **Unverified Account** - Account PayPal sandbox belum terverifikasi
3. **PayPal Policy** - PayPal memaksa backup payment method

## Solusi 1: Gunakan PayPal Test Account yang Sudah Ada Balance

### Login dengan Test Account ini:
- **Email**: `sb-testing-buyer@personal.example.com`
- **Password**: `TestPassword123`

Atau buat account baru di PayPal Developer Console:

### Buat PayPal Sandbox Account Baru:

1. **Login ke PayPal Developer Console**:
   - Buka: https://developer.paypal.com/
   - Login dengan akun PayPal Developer Anda

2. **Buat Test Account**:
   - Pilih "Sandbox" → "Accounts" 
   - Klik "Create Account"
   - **Account Type**: Personal (Buyer Account)
   - **Email**: `test-buyer-[random]@personal.example.com`
   - **Password**: `TestPassword123`
   - **PayPal Balance**: $1000.00 USD
   - **Bank Account**: Yes
   - **Credit Card**: No (Important!)

3. **Account Settings**:
   - **Account Status**: Verified ✅
   - **Email Status**: Confirmed ✅  
   - **PayPal Balance**: $1000+ USD

## Solusi 2: Konfigurasi Lebih Ketat (Sudah Diterapkan)

### Perubahan yang Sudah Dibuat:

```javascript
// PayPal SDK dengan disable funding yang lebih ketat
script.src = `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}&currency=USD&disable-funding=card,credit,paylater,bancontact,blik,eps,giropay,ideal,mercadopago,mybank,p24,sepa,sofort,venmo&enable-funding=paypal`;

// PayPal Order dengan payment preference
payment_source: {
  paypal: {
    experience_context: {
      payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
      user_action: 'PAY_NOW'
    }
  }
}
```

## Solusi 3: Testing Steps

### Langkah Testing yang Benar:

1. **Clear Browser Cache & Cookies**
2. **Buka Checkout Page**
3. **Pilih E-Wallet Payment**
4. **Klik PayPal Button**
5. **Login dengan Test Account** (yang memiliki sufficient balance)
6. **Pilih "Pay with PayPal Balance"** (jangan pilih kartu)

### Jika Masih Diminta Kartu:

- **Skip** atau **Cancel** proses add card
- **Pilih "Use PayPal Balance"** di payment method selection
- **Pastikan balance cukup** (minimum $10 untuk testing)

## Solusi 4: Alternative Testing

### Gunakan PayPal Personal Account (Real):

Jika testing dengan real PayPal account:
1. **Pastikan ada balance** di PayPal account
2. **Link bank account** (bukan credit card)
3. **Verified account status**

### Untuk Production:

- Ganti `PAYPAL_API_BASE` ke `https://api-m.paypal.com`
- Gunakan live Client ID & Secret
- Test dengan real PayPal account yang verified

## Expected Behavior

✅ **Yang Seharusnya Terjadi**:
1. User klik PayPal button
2. Redirect ke PayPal login
3. Login dengan email/password
4. **Hanya tampil opsi**: "Pay with PayPal Balance" atau "Pay with Bank Account"
5. **TIDAK ada opsi**: Credit Card, Debit Card, Pay Later

❌ **Jika Masih Ada Masalah**:
- Coba dengan PayPal account yang berbeda
- Pastikan account sudah verified di sandbox
- Check balance cukup untuk transaksi

## Debug Info

### Check PayPal Configuration:
```bash
# Environment Variables
PAYPAL_CLIENT_ID=AYdEC3kK3HidMs2-vZhFpACW9Ok7ysnVyxW0OUvy-4oDaGUZFy3GxpA96xrgvmKD8EQVYcjFLOfEZ8Xs
PAYPAL_API_BASE=https://api-m.sandbox.paypal.com
```

### Browser Console Logs:
- Check for PayPal SDK errors
- Verify funding options disabled
- Check order creation success

---

**Note**: PayPal sandbox behavior kadang tidak konsisten. Jika masih ada masalah, coba clear browser data dan gunakan incognito mode.
