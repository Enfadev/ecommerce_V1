import React from "react";
import InventoryManager from "../../../components/InventoryManager";


export default function InventoryPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="p-6">
        <InventoryManager />
      </div>
    </main>
  );
}
