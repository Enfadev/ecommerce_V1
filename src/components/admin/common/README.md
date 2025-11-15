# Admin Common Components Library

Reusable components for building consistent admin interfaces in the Next.js e-commerce application.

## 📦 Installation

All components are available from a single import:

```tsx
import { StatCard, AdminDialog, AdminFilters, PaginationControls, AdminTable, StatusBadge, SmartStatusBadge, PageHeader, SectionHeader, LoadingState, EmptyState, ErrorState } from "@/components/admin/common";
```

## 🧩 Components

### StatCard

Display statistics with icon, value, and optional trend indicator.

```tsx
import { Users } from "lucide-react";

<StatCard title="Total Users" value="1,234" description="Active users this month" icon={Users} iconColor="text-blue-600" iconBgColor="bg-blue-100" trend={{ value: 12.5, isPositive: true }} />;
```

**Props:**

- `title: string` - Stat label
- `value: string | number` - Main value to display
- `description?: string` - Optional description text
- `icon: LucideIcon` - Icon component from lucide-react
- `trend?: { value: number, isPositive: boolean }` - Optional trend indicator
- `iconColor?: string` - Icon color class (default: text-primary)
- `iconBgColor?: string` - Icon background class (default: bg-primary/10)
- `children?: ReactNode` - Custom content below value

---

### AdminDialog

Generic dialog with confirmation actions.

```tsx
<AdminDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Delete User"
  description="Are you sure? This action cannot be undone."
  confirmText="Delete"
  cancelText="Cancel"
  confirmVariant="destructive"
  onConfirm={handleDelete}
  isLoading={isDeleting}
>
  <p>
    User: {user.name} ({user.email})
  </p>
</AdminDialog>
```

**Props:**

- `open: boolean` - Dialog visibility state
- `onOpenChange: (open: boolean) => void` - State change handler
- `title: string` - Dialog title
- `description?: string` - Optional description
- `children: ReactNode` - Dialog content
- `onConfirm?: () => void` - Confirm button handler
- `onCancel?: () => void` - Cancel button handler (defaults to close)
- `confirmText?: string` - Confirm button text (default: "Confirm")
- `cancelText?: string` - Cancel button text (default: "Cancel")
- `confirmVariant?: ButtonVariant` - Confirm button style
- `isLoading?: boolean` - Loading state
- `disableConfirm?: boolean` - Disable confirm button

---

### AdminFilters

Search and filter controls for admin tables.

```tsx
<AdminFilters
  searchValue={search}
  searchPlaceholder="Search users..."
  onSearchChange={setSearch}
  onSearchSubmit={handleSearch}
  filters={[
    {
      label: "Status",
      value: statusFilter,
      options: [
        { label: "All", value: "all" },
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
      onChange: setStatusFilter,
    },
    {
      label: "Role",
      value: roleFilter,
      options: [
        { label: "All", value: "all" },
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ],
      onChange: setRoleFilter,
    },
  ]}
  customFilters={<Button variant="outline">Export</Button>}
/>
```

**Props:**

- `searchValue?: string` - Search input value
- `searchPlaceholder?: string` - Search placeholder text
- `onSearchChange?: (value: string) => void` - Search input handler
- `onSearchSubmit?: () => void` - Search submit handler (Enter key)
- `showSearch?: boolean` - Show search input (default: true)
- `filters?: FilterConfig[]` - Array of filter configurations
- `customFilters?: ReactNode` - Additional custom filter elements

**FilterConfig:**

```tsx
{
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}
```

---

### PaginationControls

Smart pagination with ellipsis and mobile responsive.

```tsx
<PaginationControls
  pagination={{
    page: 2,
    limit: 10,
    total: 150,
    totalPages: 15,
  }}
  onPageChange={setPage}
  loading={isLoading}
  showInfo={true}
/>
```

**Props:**

- `pagination: PaginationData` - Pagination state
- `onPageChange: (page: number) => void` - Page change handler
- `loading?: boolean` - Disable controls during loading
- `showInfo?: boolean` - Show "Showing X to Y of Z" text

**PaginationData:**

```tsx
{
  page: number; // Current page (1-indexed)
  limit: number; // Items per page
  total: number; // Total items count
  totalPages: number; // Total pages count
}
```

---

### AdminTable

Generic table component with pagination and state management.

```tsx
<AdminTable
  title="Users"
  description="Manage all users"
  icon={Users}
  data={users}
  columns={[
    {
      header: "Name",
      accessor: "name",
      className: "font-medium",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Status",
      render: (user) => <SmartStatusBadge status={user.status} />,
    },
    {
      header: "Actions",
      render: (user) => <Button onClick={() => handleEdit(user)}>Edit</Button>,
    },
  ]}
  keyExtractor={(user) => user.id}
  pagination={pagination}
  onPageChange={setPage}
  loading={isLoading}
  emptyMessage="No users found"
  emptyIcon={Users}
  headerActions={<Button>Add User</Button>}
/>
```

**Props:**

- `title: string` - Table title
- `description?: string` - Table description
- `icon?: LucideIcon` - Title icon
- `data: T[]` - Array of data items
- `columns: Column<T>[]` - Column configurations
- `keyExtractor: (item: T) => string | number` - Unique key extractor
- `loading?: boolean` - Loading state
- `emptyMessage?: string` - Empty state message
- `emptyIcon?: LucideIcon` - Empty state icon
- `pagination?: PaginationData` - Pagination config
- `onPageChange?: (page: number) => void` - Pagination handler
- `headerActions?: ReactNode` - Header action buttons
- `rowClassName?: (item: T) => string` - Custom row styling

**Column:**

```tsx
{
  header: string;              // Column header text
  accessor?: keyof T;          // Data property key
  render?: (item: T) => ReactNode;  // Custom render function
  className?: string;          // Cell class names
}
```

---

### StatusBadge & SmartStatusBadge

Display status with appropriate colors.

```tsx
// Manual variant selection
<StatusBadge status="Active" variant="success" />

// Auto-detect variant from status text
<SmartStatusBadge status="Pending" />
<SmartStatusBadge status="Delivered" />
<SmartStatusBadge status="Cancelled" />
```

**Auto-detection Rules:**

- **Success** (green): delivered, completed, success, active, verified, paid, approved
- **Warning** (yellow): pending, processing, in progress, unverified
- **Danger** (red): cancelled, failed, rejected, inactive, error
- **Info** (blue): shipped, info, new
- **Secondary** (gray): default/other

**Props:**

- `status: string` - Status text to display
- `variant?: StatusVariant` - Color variant (default, success, warning, danger, info, secondary)
- `className?: string` - Additional classes

**Utility Function:**

```tsx
import { getStatusVariant } from "@/components/admin/common";

const variant = getStatusVariant("completed"); // returns "success"
```

---

### PageHeader & SectionHeader

Consistent page and section headers.

```tsx
import { Settings } from 'lucide-react';

// Page header (top of page)
<PageHeader
  title="Settings"
  description="Manage application settings"
  icon={Settings}
  actions={
    <>
      <Button variant="outline">Cancel</Button>
      <Button>Save Changes</Button>
    </>
  }
/>

// Section header (within page)
<SectionHeader
  title="User Preferences"
  description="Configure user-specific settings"
  actions={<Button size="sm">Reset</Button>}
  className="mb-4"
/>
```

---

### LoadingState, EmptyState, ErrorState

Consistent state displays.

```tsx
// Loading
<LoadingState message="Loading users..." />
<LoadingState message="Please wait..." fullScreen />

// Empty
<EmptyState
  title="No users found"
  description="Try adjusting your filters or create a new user."
  icon={<Users className="w-12 h-12 text-muted-foreground" />}
  action={<Button>Create User</Button>}
/>

// Error
<ErrorState
  title="Failed to load"
  message="Unable to fetch user data. Please try again."
  action={<Button onClick={retry}>Retry</Button>}
/>
```

---

## 📝 Usage Patterns

### Complete Table Example

```tsx
"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { AdminTable, AdminFilters, SmartStatusBadge, AdminDialog, type PaginationData } from "@/components/admin/common";
import { Button } from "@/components/ui/button";

export function UserManagement() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const { data: users, isLoading } = useUsers({ search, status: statusFilter, page });

  const pagination: PaginationData = {
    page,
    limit: 10,
    total: users?.total || 0,
    totalPages: Math.ceil((users?.total || 0) / 10),
  };

  return (
    <div className="space-y-6">
      <AdminFilters
        searchValue={search}
        searchPlaceholder="Search users..."
        onSearchChange={setSearch}
        filters={[
          {
            label: "Status",
            value: statusFilter,
            options: [
              { label: "All", value: "all" },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ],
            onChange: setStatusFilter,
          },
        ]}
      />

      <AdminTable
        title="Users"
        icon={Users}
        data={users?.data || []}
        columns={[
          { header: "Name", accessor: "name" },
          { header: "Email", accessor: "email" },
          {
            header: "Status",
            render: (user) => <SmartStatusBadge status={user.status} />,
          },
          {
            header: "Actions",
            render: (user) => (
              <Button variant="destructive" size="sm" onClick={() => setDeleteUserId(user.id)}>
                Delete
              </Button>
            ),
          },
        ]}
        keyExtractor={(user) => user.id}
        pagination={pagination}
        onPageChange={setPage}
        loading={isLoading}
        emptyIcon={Users}
      />

      <AdminDialog
        open={!!deleteUserId}
        onOpenChange={(open) => !open && setDeleteUserId(null)}
        title="Delete User"
        description="This action cannot be undone."
        confirmText="Delete"
        confirmVariant="destructive"
        onConfirm={() => {
          // Handle delete
          setDeleteUserId(null);
        }}
      >
        <p>Are you sure you want to delete this user?</p>
      </AdminDialog>
    </div>
  );
}
```

---

## 🎨 Customization

### Custom Styling

All components accept `className` prop for additional styling:

```tsx
<StatusBadge status="Premium" variant="info" className="text-lg px-4 py-2" />
```

### Extending Components

Components are designed to be extended:

```tsx
import { AdminTable } from "@/components/admin/common";

export function CustomTable(props) {
  return <AdminTable {...props} rowClassName={(item) => (item.isPriority ? "bg-yellow-50" : "")} />;
}
```

---

## 🚀 Benefits

- **DRY Principle:** Eliminate code duplication
- **Consistency:** Unified UI patterns
- **Type Safety:** Full TypeScript support
- **Responsive:** Mobile-friendly by default
- **Accessible:** Built on shadcn/ui with accessibility features
- **Tree Shaking:** Import only what you need
- **Maintainable:** Single source of truth

---

## 📚 Related Documentation

- [Admin Refactoring Summary](../ADMIN_REFACTORING_SUMMARY.md)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)

---

**Created:** December 2024  
**Total Lines:** 568  
**Components:** 9  
**Exports:** 15
