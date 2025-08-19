"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function JWTTestPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const testLogin = async () => {
    setIsLoading(true);
    setMessage("");
    
    try {
      const response = await fetch("/api/signin-dev", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        setMessage("Login successful! JWT token set in httpOnly cookie.");
      } else {
        setMessage(`Login failed: ${data.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testProfile = async () => {
    setIsLoading(true);
    setMessage("");
    
    try {
      const response = await fetch("/api/profile-dev", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        setMessage("Profile fetched successfully using JWT from cookie!");
      } else {
        setMessage(`Profile fetch failed: ${data.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testLogout = async () => {
    setIsLoading(true);
    setMessage("");
    
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setUser(null);
        setMessage("Logout successful! JWT cookie cleared.");
      } else {
        setMessage("Logout failed");
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>JWT Authentication Test</CardTitle>
          <CardDescription>
            Test JWT implementation with httpOnly cookies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Accounts */}
          <Alert>
            <AlertDescription>
              <strong>Test Accounts:</strong><br />
              Admin: admin@test.com / admin123<br />
              User: user@test.com / user123
            </AlertDescription>
          </Alert>

          {/* Login Form */}
          <div className="space-y-4">
            <h3 className="font-semibold">1. Test Login</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button onClick={testLogin} disabled={isLoading} className="w-full">
              {isLoading ? "Testing..." : "Test Login"}
            </Button>
          </div>

          {/* Profile Test */}
          <div className="space-y-4">
            <h3 className="font-semibold">2. Test Profile (Protected Route)</h3>
            <Button onClick={testProfile} disabled={isLoading} className="w-full">
              {isLoading ? "Testing..." : "Test Get Profile"}
            </Button>
          </div>

          {/* Logout Test */}
          <div className="space-y-4">
            <h3 className="font-semibold">3. Test Logout</h3>
            <Button onClick={testLogout} disabled={isLoading} variant="destructive" className="w-full">
              {isLoading ? "Testing..." : "Test Logout"}
            </Button>
          </div>

          {/* User Info */}
          {user && (
            <div className="space-y-4">
              <h3 className="font-semibold">Current User:</h3>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div><strong>ID:</strong> {user.id}</div>
                    <div><strong>Name:</strong> {user.name}</div>
                    <div><strong>Email:</strong> {user.email}</div>
                    <div><strong>Role:</strong> <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>{user.role}</Badge></div>
                    <div><strong>Created:</strong> {new Date(user.createdAt).toLocaleString()}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Messages */}
          {message && (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {/* Instructions */}
          <Alert>
            <AlertDescription>
              <strong>How to Test:</strong><br />
              1. Use test accounts to login<br />
              2. Check browser cookies (should see auth-token as httpOnly)<br />
              3. Test profile fetch (should work after login)<br />
              4. Test logout (should clear cookie)<br />
              5. Try profile fetch after logout (should fail)
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
