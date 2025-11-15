"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface User {
  id: number;
  name: string | null;
  email: string;
  role: string;
  emailVerified: string | null;
  image: string | null;
  phoneNumber: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    orders: number;
    reviews: number;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search,
        role: roleFilter,
      });

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, roleFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    loadUsers();
  };

  const updateUserRole = async (userId: number, newRole: string) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("User role updated successfully");
        loadUsers();
        return true;
      } else {
        toast.error(data.message || "Failed to update user role");
        return false;
      }
    } catch (error) {
      console.error("Update role error:", error);
      toast.error("Failed to update user role");
      return false;
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("User deleted successfully");
        loadUsers();
        return true;
      } else {
        toast.error(data.message || "Failed to delete user");
        return false;
      }
    } catch (error) {
      console.error("Delete user error:", error);
      toast.error("Failed to delete user");
      return false;
    }
  };

  const goToPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const nextPage = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const previousPage = () => {
    if (pagination.page > 1) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  return {
    users,
    loading,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    pagination,
    handleSearch,
    updateUserRole,
    deleteUser,
    goToPage,
    nextPage,
    previousPage,
  };
}

export type { User, Pagination };
