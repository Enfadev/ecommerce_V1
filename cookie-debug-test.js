/**
 * Cookie Debug Test Script
 * Run this to test cookie persistence after refresh
 */

console.log('🍪 Starting Cookie Debug Test...');

// Test authentication flow
async function testAuthFlow() {
  try {
    console.log('\n1. Testing login...');
    
    // Test login
    const loginResponse = await fetch('/api/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
      })
    });
    
    console.log('Login response status:', loginResponse.status);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful:', loginData.user?.email);
      
      // Check cookies after login
      console.log('\n2. Checking auth status...');
      const authResponse = await fetch('/api/auth/check', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      const authData = await authResponse.json();
      console.log('Auth check result:', authData);
      
      if (authData.authenticated) {
        console.log('✅ Authentication persisted successfully!');
        
        // Test profile access
        console.log('\n3. Testing profile access...');
        const profileResponse = await fetch('/api/profile', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log('✅ Profile access successful:', profileData.user?.email);
        } else {
          console.log('❌ Profile access failed:', profileResponse.status);
        }
        
      } else {
        console.log('❌ Authentication not persisted:', authData.error);
      }
      
    } else {
      const errorData = await loginResponse.json();
      console.log('❌ Login failed:', errorData.error);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run test when page loads
if (typeof window !== 'undefined') {
  // Browser environment
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🌐 Running in browser...');
    
    // Add test button to page
    const button = document.createElement('button');
    button.textContent = 'Test Cookie Persistence';
    button.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      padding: 10px 20px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-family: system-ui;
    `;
    
    button.addEventListener('click', testAuthFlow);
    document.body.appendChild(button);
    
    // Also run test automatically
    setTimeout(testAuthFlow, 1000);
  });
} else {
  // Node environment
  console.log('📝 Test script loaded - use in browser console');
}

// Export for manual testing
if (typeof module !== 'undefined') {
  module.exports = { testAuthFlow };
}
