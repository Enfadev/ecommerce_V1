import React from "react";
import { useSession } from "next-auth/react";
import { useAuth } from "@/hooks/use-auth";

interface DebugInfoProps {
  productId: number;
}

export default function ReviewDebugInfo({ productId }: DebugInfoProps) {
  const { data: session, status: nextAuthStatus } = useSession();
  const { user: customUser, loading: customLoading, isAuthenticated } = useAuth();

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show debug info in production
  }

  return (
    <div className="bg-yellow-900/20 border border-yellow-600 rounded-xl p-4 mb-4">
      <h4 className="text-yellow-400 font-medium mb-2">🐛 Debug Info (Development Only)</h4>
      <div className="text-sm text-yellow-300 space-y-1">
        <p><strong>Product ID:</strong> {productId}</p>
        
        <div className="border-t border-yellow-600 pt-2 mt-2">
          <p className="text-yellow-400 font-medium">NextAuth Status:</p>
          <p><strong>Auth Status:</strong> {nextAuthStatus}</p>
          <p><strong>User Email:</strong> {session?.user?.email || 'Not logged in'}</p>
          <p><strong>User Name:</strong> {session?.user?.name || 'Not available'}</p>
          <p><strong>Session:</strong> {session ? 'Active' : 'None'}</p>
        </div>

        <div className="border-t border-yellow-600 pt-2 mt-2">
          <p className="text-yellow-400 font-medium">Custom Auth Status:</p>
          <p><strong>Loading:</strong> {customLoading ? 'Yes' : 'No'}</p>
          <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
          <p><strong>User Email:</strong> {customUser?.email || 'Not logged in'}</p>
          <p><strong>User Name:</strong> {customUser?.name || 'Not available'}</p>
          <p><strong>User Role:</strong> {customUser?.role || 'Not available'}</p>
        </div>
        
        <div className="mt-2 pt-2 border-t border-yellow-600">
          <p className="text-xs text-yellow-400">
            Check browser console for API call logs. Expected API calls:
          </p>
          <ul className="text-xs text-yellow-300 mt-1 list-disc list-inside">
            <li>GET /api/review/eligible-orders?productId={productId}</li>
            <li>GET /api/review?productId={productId}</li>
            <li>GET /api/review/stats?productId={productId}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
