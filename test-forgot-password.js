// Test script for Forgot Password API
// Run this in browser console or with Node.js

// Test 1: Request Password Reset
async function testForgotPassword() {
  console.log("🧪 Testing Forgot Password API...");
  
  try {
    const response = await fetch("http://localhost:3000/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "user@demo.com" // Use your test email
      }),
    });

    const data = await response.json();
    console.log("✅ Response:", data);
    
    if (data.success) {
      console.log("✅ SUCCESS: Password reset email sent!");
      console.log("📧 Check your email for the reset link");
    } else {
      console.log("❌ ERROR:", data.error);
    }
  } catch (error) {
    console.error("❌ Request failed:", error);
  }
}

// Test 2: Validate Reset Token
async function testValidateToken(token) {
  console.log("🧪 Testing Token Validation...");
  
  try {
    const response = await fetch(`http://localhost:3000/api/auth/reset-password?token=${token}`);
    const data = await response.json();
    
    console.log("✅ Response:", data);
    
    if (data.valid) {
      console.log("✅ SUCCESS: Token is valid");
      console.log("📧 Email:", data.email);
    } else {
      console.log("❌ Token is invalid:", data.error);
    }
  } catch (error) {
    console.error("❌ Request failed:", error);
  }
}

// Test 3: Reset Password
async function testResetPassword(token, newPassword) {
  console.log("🧪 Testing Password Reset...");
  
  try {
    const response = await fetch("http://localhost:3000/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        password: newPassword
      }),
    });

    const data = await response.json();
    console.log("✅ Response:", data);
    
    if (data.success) {
      console.log("✅ SUCCESS: Password has been reset!");
      console.log("🔐 You can now sign in with your new password");
    } else {
      console.log("❌ ERROR:", data.error);
    }
  } catch (error) {
    console.error("❌ Request failed:", error);
  }
}

// Run all tests
async function runAllTests() {
  console.log("🚀 Starting Forgot Password API Tests\n");
  
  // Step 1: Request password reset
  console.log("Step 1: Request Password Reset");
  await testForgotPassword();
  
  console.log("\n⏸️ PAUSE: Check your email for the reset link");
  console.log("Copy the token from the URL (everything after ?token=)");
  console.log("Then run these commands in console:\n");
  console.log('testValidateToken("your-token-here")');
  console.log('testResetPassword("your-token-here", "NewPassword123")');
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testForgotPassword,
    testValidateToken,
    testResetPassword,
    runAllTests
  };
}

// Usage instructions
console.log(`
═══════════════════════════════════════════════════════
   FORGOT PASSWORD API TEST SCRIPT
═══════════════════════════════════════════════════════

Usage in Browser Console:
1. Open http://localhost:3000 in browser
2. Open Developer Tools (F12)
3. Paste this entire script
4. Run: runAllTests()

Manual Testing:
1. testForgotPassword() - Request reset email
2. Check your email for the reset link
3. Copy the token from the URL
4. testValidateToken("token") - Validate token
5. testResetPassword("token", "NewPass123") - Reset password

Test Accounts:
- admin@demo.com / Admin1234
- user@demo.com / User1234

═══════════════════════════════════════════════════════
`);
