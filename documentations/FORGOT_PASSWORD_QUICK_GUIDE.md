# Forgot Password - Quick Setup Guide

## 🚀 Quick Start

### 1. Environment Setup
Add to your `.env` file:
```bash
RESEND_API_KEY=re_123456789
EMAIL_FROM=onboarding@resend.dev
```

### 2. Get Resend API Key
1. Visit [https://resend.com/signup](https://resend.com/signup)
2. Sign up for free account
3. Go to API Keys section
4. Create new API key
5. Copy and paste to `.env`

### 3. Test It!
1. Start dev server: `npm run dev`
2. Go to: `http://localhost:3000/signin`
3. Click **"Forgot password?"**
4. Enter your email
5. Check your inbox for reset link

## 📧 Test Emails

### Development (Free)
Use: `onboarding@resend.dev` - No verification needed!

### Production
1. Verify your domain in Resend dashboard
2. Use: `noreply@yourdomain.com`

## 🔗 Available Routes

- **Request Reset**: `/forgot-password`
- **Reset Password**: `/reset-password?token=xxx`
- **Sign In**: `/signin` (has forgot password link)

## ⚙️ API Endpoints

```bash
# Request reset email
POST /api/auth/forgot-password
Body: { "email": "user@example.com" }

# Validate token
GET /api/auth/reset-password?token=xxx

# Reset password
POST /api/auth/reset-password
Body: { "token": "xxx", "password": "newPass123" }
```

## 🧪 Test Credentials

After running seed:
- **Admin**: admin@demo.com / Admin1234
- **User**: user@demo.com / User1234

## 🔒 Security Features

✅ Secure token generation (crypto.randomBytes)
✅ 1-hour token expiration
✅ One-time use tokens
✅ Password hashing with bcrypt
✅ Email enumeration protection
✅ OAuth account protection

## 📱 Mobile Responsive

All pages are fully responsive and work great on:
- 📱 Mobile devices
- 📱 Tablets  
- 💻 Desktop

## 🎨 Features

- Beautiful email template with gradient design
- Loading states and animations
- Success/error feedback with toast notifications
- Form validation (client & server)
- Dark mode support
- Accessible UI components

## 📚 Full Documentation

See [FORGOT_PASSWORD_FEATURE.md](./FORGOT_PASSWORD_FEATURE.md) for complete documentation.

## ⚡ Common Issues

### Email not received?
1. Check spam folder
2. Verify API key is correct
3. Check Resend dashboard logs

### Token invalid?
1. Token expires after 1 hour
2. Can only be used once
3. Check database for token

## 💡 Pro Tips

1. For testing, use `onboarding@resend.dev` (no setup needed)
2. For production, verify your domain first
3. Add rate limiting in production
4. Monitor email delivery in Resend dashboard

## 🛠️ Customization

Want to customize the email template?
Edit: `src/lib/email.ts`

Want to change token expiration?
Edit: `src/app/api/auth/forgot-password/route.ts`

---

**Need help?** Check the full documentation or Resend docs at [resend.com/docs](https://resend.com/docs)
