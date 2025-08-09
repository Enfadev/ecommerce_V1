# Test Guide for Admin Page Management

## Quick Test Checklist

### 1. Database Setup ✅
- [x] Models added to schema.prisma
- [x] Database pushed with `npx prisma db push`
- [x] Prisma client generated with `npx prisma generate`
- [x] Seed data created with `node prisma/seed-pages.js`

### 2. API Endpoints ✅
- [x] `/api/home-page` - Created
- [x] `/api/about-page` - Created
- [x] `/api/event-page` - Created
- [x] `/api/product-page` - Created
- [x] `/api/contact-page` - Already exists

### 3. Components ✅
- [x] `AdminPageManager.tsx` - Main page manager
- [x] `AdminHomePageEditor.tsx` - Home page editor
- [x] `AdminAboutPageEditor.tsx` - About page editor
- [x] `AdminEventPageEditor.tsx` - Event page editor
- [x] `AdminProductPageEditor.tsx` - Product page editor
- [x] `AdminContactPageEditor.tsx` - Already exists

### 4. Admin Route ✅
- [x] `/admin/page-management` - Page created
- [x] Added to admin sidebar navigation

### 5. Testing Steps

#### Manual Testing:
1. **Access Admin Panel**
   - Go to `http://localhost:3001/admin`
   - Click on "Page Management" in sidebar

2. **Test Each Page Editor**
   - **Home Page**: Edit hero title, add slides, features
   - **About Page**: Edit company story, add team members
   - **Event Page**: Add events, categories
   - **Product Page**: Configure promotional banner
   - **Contact Page**: Update contact information

3. **Test Save Functionality**
   - Make changes in any editor
   - Click "Save Changes" button
   - Verify success notification appears
   - Refresh page to confirm changes persist

#### API Testing (using browser console):
```javascript
// Test Home Page API
fetch('/api/home-page')
  .then(res => res.json())
  .then(data => console.log('Home Page Data:', data));

// Test About Page API
fetch('/api/about-page')
  .then(res => res.json())
  .then(data => console.log('About Page Data:', data));

// Test Event Page API
fetch('/api/event-page')
  .then(res => res.json())
  .then(data => console.log('Event Page Data:', data));

// Test Product Page API
fetch('/api/product-page')
  .then(res => res.json())
  .then(data => console.log('Product Page Data:', data));
```

### 6. Expected Behavior

#### When visiting `/admin/page-management`:
- [ ] Page loads without errors
- [ ] Navigation tabs show all 5 pages (Home, About, Products, Events, Contact)
- [ ] Clicking tabs switches between different editors
- [ ] Each editor shows form fields with existing data
- [ ] Save buttons are functional

#### When editing content:
- [ ] Form fields are editable
- [ ] Add/Remove buttons work for dynamic sections
- [ ] Save operation shows loading state
- [ ] Success/error notifications appear
- [ ] Data persists after save

#### Data Structure:
- [ ] All JSON fields properly structured
- [ ] Arrays contain proper objects
- [ ] Required fields are not null
- [ ] Timestamps update correctly

### 7. Troubleshooting

#### Common Issues:
1. **TypeScript Errors**: Run `npx prisma generate` if seeing Prisma client errors
2. **Database Errors**: Ensure database is running and connection string is correct
3. **API Errors**: Check server console for detailed error messages
4. **UI Errors**: Check browser console for JavaScript errors

#### Debug Commands:
```bash
# Check database connection
npx prisma studio

# Reset database (if needed)
npx prisma db push --force-reset

# Check server logs
npm run dev
```

### 8. Success Criteria

✅ **Fully Functional** when:
- All 5 page editors load without errors
- Data can be saved and retrieved successfully
- UI is responsive and user-friendly
- Admin can edit any page content
- Changes persist across sessions
- No TypeScript compilation errors
- No runtime JavaScript errors

This system successfully provides a comprehensive content management solution for all main pages of the e-commerce website.
