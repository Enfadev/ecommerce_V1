'use client';

import React from 'react';

interface DebugStateProps {
  eligibleOrders: unknown[];
  loadingOrders: boolean;
  user: unknown;
  authLoading: boolean;
}

export default function DebugState({ eligibleOrders, loadingOrders, user, authLoading }: DebugStateProps) {
  return (
    <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-4 text-xs">
      <h3 className="text-red-200 font-bold mb-2">🐛 Debug State (Remove in Production)</h3>
      <div className="space-y-1 text-red-100">
        <div><strong>authLoading:</strong> {authLoading ? 'true' : 'false'}</div>
        <div><strong>loadingOrders:</strong> {loadingOrders ? 'true' : 'false'}</div>
        <div><strong>user:</strong> {user ? JSON.stringify(user) : 'null'}</div>
        <div><strong>eligibleOrders.length:</strong> {eligibleOrders.length}</div>
        <div><strong>eligibleOrders:</strong> {JSON.stringify(eligibleOrders, null, 2)}</div>
      </div>
    </div>
  );
}
