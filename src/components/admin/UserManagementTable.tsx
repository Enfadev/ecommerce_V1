"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useUserManagement, type User } from "@/hooks/admin/useUserManagement";
import { UserFilters } from "./users/UserFilters";
import { UsersTable } from "./users/UsersTable";
import { UserRoleDialog } from "./users/UserRoleDialog";
import { UserDeleteDialog } from "./users/UserDeleteDialog";

export default function UserManagementTable() {
  const { users, loading, search, setSearch, roleFilter, setRoleFilter, pagination, handleSearch, updateUserRole, deleteUser, nextPage, previousPage } = useUserManagement();

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    user: User | null;
  }>({ open: false, user: null });

  const [roleDialog, setRoleDialog] = useState<{
    open: boolean;
    user: User | null;
  }>({ open: false, user: null });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <UserFilters search={search} roleFilter={roleFilter} onSearchChange={setSearch} onRoleFilterChange={setRoleFilter} onSearchSubmit={handleSearch} />

          <UsersTable
            users={users}
            loading={loading}
            pagination={pagination}
            onRoleChange={(user) => setRoleDialog({ open: true, user })}
            onDelete={(user) => setDeleteDialog({ open: true, user })}
            onPreviousPage={previousPage}
            onNextPage={nextPage}
          />
        </CardContent>
      </Card>

      <UserRoleDialog
        open={roleDialog.open}
        user={roleDialog.user}
        onOpenChange={(open) => {
          if (!open) setRoleDialog({ open: false, user: null });
        }}
        onConfirm={updateUserRole}
      />

      <UserDeleteDialog
        open={deleteDialog.open}
        user={deleteDialog.user}
        onOpenChange={(open) => {
          if (!open) setDeleteDialog({ open: false, user: null });
        }}
        onConfirm={deleteUser}
      />
    </div>
  );
}
