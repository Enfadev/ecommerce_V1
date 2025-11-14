# Forgot Password Feature Documentation

## Overview
Fitur forgot password memungkinkan user untuk mereset password mereka melalui email verification menggunakan Resend email service.

## Features
- ✅ Request password reset via email
- ✅ Secure token generation with 1-hour expiration
- ✅ Beautiful email template with responsive design
- ✅ Token validation before password reset
- ✅ One-time use token (cannot be reused)
- ✅ Password strength validation (minimum 8 characters)
- ✅ User-friendly UI with loading states
- ✅ Success/error feedback

## Setup Instructions

### 1. Install Dependencies
```bash
npm install resend
```

### 2. Configure Environment Variables
Add the following to your `.env` file:

```bash
# Resend Email Configuration
RESEND_API_KEY=your-resend-api-key-here
EMAIL_FROM=noreply@yourdomain.com
```

**Getting Resend API Key:**
1. Sign up at [https://resend.com](https://resend.com)
2. Go to API Keys section
3. Create a new API key
4. Copy and paste it to your `.env` file

**Email From Address:**
- For testing: Use `onboarding@resend.dev` (provided by Resend)
- For production: Use your verified domain email (e.g., `noreply@yourdomain.com`)
- You need to verify your domain in Resend dashboard for production use

### 3. Database Migration
The migration has already been applied. The `password_reset_tokens` table includes:
- `id`: Auto-increment primary key
- `email`: User email address
- `token`: Unique reset token
- `expires`: Token expiration time (1 hour)
- `used`: Boolean flag to prevent token reuse
- `createdAt`: Timestamp

### 4. Test the Feature
1. Go to `http://localhost:3000/signin`
2. Click "Forgot password?" link
3. Enter your email address
4. Check your email for the reset link
5. Click the link and enter your new password

## File Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── forgot-password/
│   │   │   └── page.tsx          # Forgot password request page
│   │   └── reset-password/
│   │       └── page.tsx           # Reset password page
│   └── api/
│       └── auth/
│           ├── forgot-password/
│           │   └── route.ts       # API: Send reset email
│           └── reset-password/
│               └── route.ts       # API: Verify token & reset password
├── lib/
│   └── email.ts                   # Email service (Resend)
└── prisma/
    └── schema.prisma              # PasswordResetToken model

```

## API Endpoints

### POST `/api/auth/forgot-password`
Request a password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Password reset email sent successfully. Please check your inbox."
}
```

**Response (Error):**
```json
{
  "error": "This account uses OAuth authentication. Please sign in with your social account."
}
```

### GET `/api/auth/reset-password?token=<token>`
Validate a reset token.

**Response (Valid Token):**
```json
{
  "valid": true,
  "email": "user@example.com"
}
```

**Response (Invalid Token):**
```json
{
  "valid": false,
  "error": "Invalid or expired reset link"
}
```

### POST `/api/auth/reset-password`
Reset the password using a valid token.

**Request Body:**
```json
{
  "token": "abc123...",
  "password": "newPassword123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Password has been reset successfully. You can now sign in with your new password."
}
```

**Response (Error):**
```json
{
  "error": "Password must be at least 8 characters long"
}
```

## Security Features

### Token Security
- **Cryptographically secure**: Uses `crypto.randomBytes(32)` for token generation
- **One-time use**: Token is marked as `used` after successful reset
- **Time-limited**: Expires after 1 hour
- **Unique**: Each token is unique and stored in database
- **Indexed**: Email field is indexed for fast lookup

### Password Security
- **Minimum length**: 8 characters required
- **Hashing**: Passwords are hashed using bcrypt before storage
- **Validation**: Client and server-side validation

### Privacy Protection
- **Generic responses**: Always returns success message even if email doesn't exist (prevents email enumeration)
- **OAuth protection**: Prevents password reset for OAuth-only accounts
- **Token cleanup**: Old unused tokens are deleted when new request is made

## Email Template Features

The email template includes:
- 📧 **Professional design** with gradient colors
- 📱 **Responsive layout** for all devices
- 🔒 **Security note** about expiration time
- 🔗 **Clickable button** and fallback link
- 🎨 **Brand customization** with logo and colors
- ⚡ **Fast loading** with inline CSS

## User Experience Flow

### 1. Request Reset
```
User → Forgot Password Page → Enter Email → Submit
→ API validates email → Send email → Success message
```

### 2. Receive Email
```
User receives email → Beautiful template with button
→ Click "Reset Password" button
```

### 3. Reset Password
```
Token validation → Reset Password Page → Enter new password
→ Confirm password → Submit → Success → Redirect to Sign In
```

## Error Handling

### User-Facing Errors
- Invalid email format
- Email not found (hidden for security)
- OAuth account detected
- Token expired
- Token already used
- Password too short
- Passwords don't match
- Network errors

### Developer Errors
All errors are logged to console for debugging:
```javascript
console.error("Error sending password reset email:", error);
```

## Testing Checklist

- [ ] Request reset for existing email
- [ ] Request reset for non-existing email (should show success for security)
- [ ] Verify email is received
- [ ] Click reset link in email
- [ ] Token validation works
- [ ] Password reset with valid token
- [ ] Try to reuse same token (should fail)
- [ ] Wait for token to expire and try (should fail)
- [ ] Try reset for OAuth account (should fail)
- [ ] Password validation (min 8 chars)
- [ ] Confirm password matching
- [ ] Sign in with new password

## Production Checklist

### Before Deployment
- [ ] Set up Resend account
- [ ] Verify your domain in Resend
- [ ] Update `EMAIL_FROM` to your domain email
- [ ] Add `RESEND_API_KEY` to production environment
- [ ] Test email delivery in production
- [ ] Set up email monitoring/alerts
- [ ] Configure rate limiting for forgot password endpoint

### Resend Domain Verification
1. Go to Resend Dashboard → Domains
2. Add your domain (e.g., `yourdomain.com`)
3. Add DNS records provided by Resend:
   - TXT record for verification
   - MX record for receiving emails
   - DKIM records for authentication
4. Wait for verification (usually a few minutes)
5. Use `noreply@yourdomain.com` or any email from your domain

### Rate Limiting Recommendation
To prevent abuse, consider implementing rate limiting:
```typescript
// Maximum 3 requests per email per hour
// Maximum 10 requests per IP per hour
```

## Customization

### Email Template
Edit `src/lib/email.ts` to customize:
- Colors and branding
- Logo and images
- Text content
- Footer information
- Social links

### Token Expiration
Change expiration time in `src/app/api/auth/forgot-password/route.ts`:
```typescript
const expires = new Date(Date.now() + 3600000); // 1 hour
// Change to: Date.now() + 7200000 for 2 hours
```

### Password Requirements
Modify validation in:
- Client: `src/app/(auth)/reset-password/page.tsx`
- Server: `src/app/api/auth/reset-password/route.ts`

## Troubleshooting

### Email not received
1. Check spam folder
2. Verify `RESEND_API_KEY` is correct
3. Check Resend dashboard for delivery logs
4. Verify `EMAIL_FROM` is correct
5. Check domain verification status

### Token validation fails
1. Check database for token existence
2. Verify token hasn't expired
3. Check if token was already used
4. Clear browser cache

### Database connection errors
1. Verify DATABASE_URL in .env
2. Run `npx prisma generate`
3. Run `npx prisma migrate deploy`

## Support

For issues related to:
- **Resend**: Check [Resend Documentation](https://resend.com/docs)
- **Prisma**: Check [Prisma Documentation](https://www.prisma.io/docs)
- **Next.js**: Check [Next.js Documentation](https://nextjs.org/docs)

## Version History

- **v1.0.0** (2025-10-15): Initial implementation
  - Basic forgot password flow
  - Resend email integration
  - Token-based reset system
  - Secure validation

## Future Enhancements

Potential features to add:
- [ ] SMS-based password reset
- [ ] Two-factor authentication for reset
- [ ] Password strength meter
- [ ] Rate limiting per IP/email
- [ ] Email notification when password is changed
- [ ] Multiple language support
- [ ] Dark mode email template
- [ ] Reset history/audit log
