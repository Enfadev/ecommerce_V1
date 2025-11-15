"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface UserFiltersProps {
  search: string;
  roleFilter: string;
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (value: string) => void;
  onSearchSubmit: () => void;
}

export function UserFilters({ search, roleFilter, onSearchChange, onRoleFilterChange, onSearchSubmit }: UserFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 flex gap-2">
        <Input placeholder="Search by name or email..." value={search} onChange={(e) => onSearchChange(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSearchSubmit()} className="flex-1" />
        <Button onClick={onSearchSubmit} size="icon">
          <Search className="w-4 h-4" />
        </Button>
      </div>

      <Select value={roleFilter} onValueChange={onRoleFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="user">User</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
