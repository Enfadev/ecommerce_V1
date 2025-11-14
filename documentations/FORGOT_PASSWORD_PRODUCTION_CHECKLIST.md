# Forgot Password - Production Deployment Checklist

## 📋 Pre-Deployment Checklist

### ✅ Development Testing
- [ ] Feature tested locally with development email
- [ ] All test scenarios passed (see below)
- [ ] Email delivery confirmed
- [ ] Password reset flow works end-to-end
- [ ] Error handling tested
- [ ] Token expiration tested
- [ ] Token reuse prevention tested

### ✅ Code Review
- [ ] Code reviewed and approved
- [ ] No console.log statements in production code
- [ ] Error messages are user-friendly
- [ ] Security best practices followed
- [ ] TypeScript types are correct
- [ ] No lint errors

### ✅ Database
- [ ] Migration files committed to repository
- [ ] Database backup created
- [ ] Migration tested on staging environment
- [ ] Index on `email` field verified
- [ ] Database performance tested

---

## 🔐 Security Checklist

### ✅ Token Security
- [ ] Token generation uses crypto.randomBytes (256-bit)
- [ ] Token expiration set (1 hour recommended)
- [ ] One-time use enforced (used flag)
- [ ] Unique constraint on token field
- [ ] Old tokens cleaned up on new request

### ✅ Password Security
- [ ] Minimum password length enforced (8 characters)
- [ ] Password hashed with bcrypt
- [ ] Hash rounds configured (10 rounds minimum)
- [ ] No password visible in logs
- [ ] No password in URL parameters

### ✅ API Security
- [ ] **IMPORTANT: Rate limiting implemented** (see below)
- [ ] CORS configured correctly
- [ ] Input validation on all endpoints
- [ ] Email enumeration protection active
- [ ] OAuth account protection active
- [ ] HTTPS enforced in production

### ✅ Email Security
- [ ] SPF records configured
- [ ] DKIM records configured
- [ ] DMARC records configured
- [ ] Domain verified in Resend
- [ ] Sender reputation monitored

---

## 📧 Resend Configuration

### ✅ Account Setup
- [ ] Resend account created
- [ ] Appropriate plan selected (Free/Pro)
- [ ] Payment method added (if paid plan)
- [ ] Billing alerts configured

### ✅ Domain Configuration
- [ ] Custom domain added to Resend
- [ ] DNS records added to domain provider:
  - [ ] TXT record for verification
  - [ ] MX records for receiving
  - [ ] DKIM records (provided by Resend)
- [ ] Domain status: Verified ✅
- [ ] Test email sent from custom domain

### ✅ API Configuration
- [ ] Production API key created
- [ ] API key added to production environment variables
- [ ] API key not committed to repository
- [ ] API key rotated if compromised
- [ ] Development and production keys separated

### ✅ Email Configuration
- [ ] `EMAIL_FROM` set to verified domain email
- [ ] Email template tested on multiple clients:
  - [ ] Gmail
  - [ ] Outlook
  - [ ] Apple Mail
  - [ ] Mobile devices
- [ ] Unsubscribe link added (if required)
- [ ] Company branding applied

---

## 🌐 Environment Configuration

### ✅ Production Environment Variables
Add to `.env.production` or hosting provider:

```bash
# Required
RESEND_API_KEY=re_prod_xxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
NEXTAUTH_URL=https://yourdomain.com
DATABASE_URL=mysql://user:pass@host:3306/db

# Optional but recommended
NEXT_PUBLIC_SITE_NAME=Your Company Name
NODE_ENV=production
```

### ✅ Environment Variable Verification
- [ ] All required variables set
- [ ] No development values in production
- [ ] Sensitive values not exposed to client
- [ ] Environment variables backed up securely
- [ ] Access to env vars restricted to authorized personnel

---

## ⚡ Rate Limiting (CRITICAL)

### ⚠️ IMPORTANT: Must Implement Before Production

Rate limiting is **NOT included** in the current implementation. You must add it to prevent abuse.

### Recommended Limits:
```javascript
// Per email address
- 3 requests per hour
- 10 requests per day

// Per IP address
- 10 requests per hour
- 50 requests per day
```

### Implementation Options:

#### Option 1: Upstash Redis (Recommended)
Already have `@upstash/ratelimit` in dependencies!

```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const passwordResetLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  prefix: "ratelimit:forgot-password",
});
```

Then in `forgot-password/route.ts`:
```typescript
const { success } = await passwordResetLimiter.limit(email);
if (!success) {
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    { status: 429 }
  );
}
```

#### Option 2: Next.js Middleware
Use `next-rate-limit` (already in dependencies):

```typescript
// middleware.ts
import { getToken } from "next-auth/jwt";
import rateLimit from "next-rate-limit";

const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500,
});

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/auth/forgot-password")) {
    try {
      await limiter.check(res, 3, "CACHE_TOKEN"); // 3 requests per hour
    } catch {
      return new NextResponse("Too Many Requests", { status: 429 });
    }
  }
}
```

### ✅ Rate Limiting Checklist
- [ ] Rate limiting library installed
- [ ] Rate limits configured per email
- [ ] Rate limits configured per IP
- [ ] Rate limit exceeded error message user-friendly
- [ ] Rate limiting tested
- [ ] Rate limiting monitored

---

## 🧪 Test Scenarios

### ✅ Happy Path
- [ ] User enters valid email
- [ ] Email received within 1 minute
- [ ] Email has correct branding
- [ ] Reset link works
- [ ] Password successfully reset
- [ ] User can login with new password

### ✅ Edge Cases
- [ ] Non-existent email (should show success for security)
- [ ] Invalid email format (should show error)
- [ ] OAuth account (should show appropriate error)
- [ ] Expired token (should show expired error)
- [ ] Already used token (should show used error)
- [ ] Password too short (should show validation error)
- [ ] Passwords don't match (should show mismatch error)

### ✅ Security Tests
- [ ] Cannot enumerate emails
- [ ] Cannot brute force tokens
- [ ] Cannot reuse tokens
- [ ] Cannot use expired tokens
- [ ] Rate limiting works
- [ ] XSS protection active
- [ ] CSRF protection active

### ✅ Load Testing
- [ ] 100 concurrent requests handled
- [ ] Email queue doesn't overflow
- [ ] Database handles load
- [ ] API response time < 2 seconds

---

## 📊 Monitoring & Logging

### ✅ Application Monitoring
- [ ] Error logging configured (Sentry, LogRocket, etc.)
- [ ] Performance monitoring active
- [ ] Uptime monitoring configured
- [ ] Alert thresholds set

### ✅ Email Monitoring
- [ ] Resend webhook configured
- [ ] Delivery rates monitored
- [ ] Bounce rates tracked
- [ ] Spam complaints monitored
- [ ] Failed sends alerted

### ✅ Security Monitoring
- [ ] Failed reset attempts logged
- [ ] Rate limit violations logged
- [ ] Suspicious patterns detected
- [ ] Security audit log active

### ✅ Metrics to Track
- [ ] Password reset requests per day
- [ ] Successful password resets
- [ ] Failed reset attempts
- [ ] Email delivery rate
- [ ] Token expiration rate
- [ ] Average completion time

---

## 🚀 Deployment Steps

### Step 1: Pre-deployment
1. [ ] Complete all checklist items above
2. [ ] Create database backup
3. [ ] Test on staging environment
4. [ ] Get approval from team/stakeholders

### Step 2: Deploy Code
1. [ ] Merge feature branch to main
2. [ ] Tag release (e.g., v1.1.0-forgot-password)
3. [ ] Deploy to production server
4. [ ] Verify deployment successful

### Step 3: Database Migration
1. [ ] Run migration in production:
   ```bash
   npm run prisma:migrate:deploy
   ```
2. [ ] Verify migration successful
3. [ ] Check database schema
4. [ ] Test with sample data

### Step 4: Verify Production
1. [ ] Visit production site
2. [ ] Test forgot password flow
3. [ ] Verify email delivery
4. [ ] Check error handling
5. [ ] Monitor logs for 1 hour

### Step 5: Post-deployment
1. [ ] Update documentation
2. [ ] Notify team of deployment
3. [ ] Monitor metrics
4. [ ] Address any issues immediately

---

## 🔄 Rollback Plan

If issues occur in production:

### Immediate Actions
1. [ ] Revert to previous deployment
2. [ ] Notify affected users (if any)
3. [ ] Document the issue

### Database Rollback
If migration needs rollback:
```bash
# Create backup first!
npm run prisma:migrate:resolve --rolled-back 20251015065308_add_password_reset_token
```

### Emergency Contacts
- [ ] DevOps team contact ready
- [ ] Database admin contact ready
- [ ] Manager/Lead contact ready

---

## 📱 User Communication

### ✅ User Documentation
- [ ] Help article written
- [ ] FAQ updated
- [ ] Support team trained
- [ ] Email support address ready

### ✅ Announcement
- [ ] Feature announcement prepared
- [ ] Email notification to users (optional)
- [ ] Social media posts (optional)
- [ ] In-app notification (optional)

---

## 📝 Documentation

### ✅ Technical Documentation
- [ ] API documentation updated
- [ ] Database schema documented
- [ ] Environment variables documented
- [ ] Deployment guide written
- [ ] Troubleshooting guide written

### ✅ User Documentation
- [ ] User guide created
- [ ] Screenshots/videos added
- [ ] FAQ section updated
- [ ] Support articles written

---

## ✅ Final Checklist

Before marking as complete:

- [ ] All sections above completed
- [ ] **Rate limiting implemented** (CRITICAL)
- [ ] Production tested
- [ ] Team trained
- [ ] Documentation complete
- [ ] Monitoring active
- [ ] Rollback plan ready
- [ ] Go-live approved

---

## 🎯 Success Metrics

Track these for 7 days post-deployment:

- [ ] Zero critical errors
- [ ] Email delivery rate > 95%
- [ ] Password reset success rate > 90%
- [ ] Average completion time < 5 minutes
- [ ] User satisfaction (via feedback/support tickets)
- [ ] Security incidents = 0

---

## 📞 Support

### If Issues Occur:

1. **Check Resend Dashboard**
   - Email delivery status
   - Error logs
   - Rate limits

2. **Check Application Logs**
   - Error messages
   - Request logs
   - Database queries

3. **Check Database**
   - Token records
   - User records
   - Migration status

4. **Contact Support**
   - Resend support: support@resend.com
   - Internal dev team
   - Database admin

---

## 🎉 Post-Deployment

After successful deployment:

- [ ] Celebrate with team! 🎊
- [ ] Document lessons learned
- [ ] Plan improvements
- [ ] Schedule review in 30 days
- [ ] Thank contributors

---

**Deployment Date:** _________________

**Deployed By:** _________________

**Verified By:** _________________

**Status:** ☐ Ready ☐ In Progress ☐ Complete

---

**Note:** This checklist should be reviewed and updated regularly based on your production experience and organizational requirements.
