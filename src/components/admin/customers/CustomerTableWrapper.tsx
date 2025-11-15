"use client";

import { useState } from "react";
import { CustomerTable } from "./CustomerTable";
import { CustomerDetailDialog } from "./CustomerDetailDialog";
import type { Customer } from "@/types/customer";

interface CustomerTableWrapperProps {
  customers: Customer[];
  totalCustomers: number;
}

export function CustomerTableWrapper({ customers, totalCustomers }: CustomerTableWrapperProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);

  const handleViewDetail = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetail(true);
  };

  return (
    <>
      <CustomerTable customers={customers} totalCustomers={totalCustomers} onViewDetail={handleViewDetail} />
      <CustomerDetailDialog customer={selectedCustomer} open={showCustomerDetail} onOpenChange={setShowCustomerDetail} />
    </>
  );
}
