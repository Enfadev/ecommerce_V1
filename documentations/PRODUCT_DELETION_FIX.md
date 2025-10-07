# Product Deletion Fix

## Issue

Products that have been ordered cannot be deleted due to foreign key constraints with the OrderItem table.

## Solution

1. **API Enhancement**: The DELETE endpoint now checks if a product has been ordered before allowing deletion
2. **Status Toggle**: Added a PATCH endpoint to toggle product status between active/inactive
3. **UI Improvements**: Admin panel now shows better error messages and provides status toggle option

## Changes Made

### 1. API Route (`/src/app/api/product/route.ts`)

- Enhanced DELETE method to check for existing order items
- Added proper error handling with descriptive messages
- Added PATCH method for status updates

### 2. Admin UI (`/src/app/(admin)/admin/product/page.tsx`)

- Added status toggle functionality
- Improved error handling with specific error messages
- Added new dropdown menu option for activate/deactivate

### 3. Database Schema (`/prisma/schema.prisma`)

- Added explicit `onDelete: Restrict` constraint to OrderItem -> Product relation

## Usage

### For products that haven't been ordered:

- Can be deleted normally using the Delete button

### For products that have been ordered:

- Cannot be deleted (will show error message)
- Can be deactivated using the new "Deactivate" option
- Deactivated products can be reactivated later

## Benefits

- Prevents data integrity issues
- Maintains order history
- Provides flexibility to temporarily hide products
- Better user experience with clear error messages

## Error Messages

- **Cannot delete**: "Cannot delete product that has been ordered. Consider changing the status to inactive instead."
- **Success messages**: Clear confirmation when actions succeed
