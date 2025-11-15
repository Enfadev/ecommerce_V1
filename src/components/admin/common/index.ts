/**
 * Common Admin Components Library
 *
 * This module exports reusable components for admin pages.
 * Use these components to maintain consistency across the admin interface.
 */

export { StatCard } from "./StatCard";
export { AdminDialog } from "./AdminDialog";
export { AdminFilters } from "./AdminFilters";
export { PaginationControls } from "./PaginationControls";
export { AdminTable } from "./AdminTable";
export { StatusBadge, SmartStatusBadge, getStatusVariant } from "./StatusBadge";
export { PageHeader, SectionHeader } from "./PageHeader";
export { LoadingState, EmptyState, ErrorState } from "./States";

export type { PaginationData } from "./PaginationControls";
export type { FilterOption } from "./AdminFilters";
export type { StatusVariant } from "./StatusBadge";
