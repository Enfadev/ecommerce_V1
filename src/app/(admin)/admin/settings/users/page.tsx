"use client";

import dynamic from "next/dynamic";

const UserManagementTable = dynamic(() => import("@/components/admin/users/UserManagementTable"), {
  loading: () => <div className="p-8 text-center text-muted-foreground">Loading users...</div>,
  ssr: false,
});

export default function UsersPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <p className="text-muted-foreground mt-1">Manage user accounts and permissions</p>
      </div>
      <UserManagementTable />
    </div>
  );
}
