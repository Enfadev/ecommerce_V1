// Test script untuk API review endpoints
// Jalankan dengan: node test-review-api.js

const baseUrl = 'http://localhost:3000';

async function testReviewAPI() {
  console.log('=== TESTING REVIEW API ENDPOINTS ===\n');

  // Test eligible orders endpoint for Product 29
  console.log('1. Testing eligible orders for Product 29...');
  try {
    const response = await fetch(`${baseUrl}/api/review/eligible-orders?productId=29`, {
      headers: {
        'Cookie': 'your-session-cookie-here' // Ganti dengan cookie session yang valid
      }
    });
    
    console.log(`Status: ${response.status}`);
    const data = await response.text();
    console.log(`Response: ${data}\n`);
  } catch (error) {
    console.error(`Error: ${error.message}\n`);
  }

  // Test eligible orders endpoint for Product 30
  console.log('2. Testing eligible orders for Product 30...');
  try {
    const response = await fetch(`${baseUrl}/api/review/eligible-orders?productId=30`, {
      headers: {
        'Cookie': 'your-session-cookie-here' // Ganti dengan cookie session yang valid
      }
    });
    
    console.log(`Status: ${response.status}`);
    const data = await response.text();
    console.log(`Response: ${data}\n`);
  } catch (error) {
    console.error(`Error: ${error.message}\n`);
  }

  // Test get reviews for Product 29
  console.log('3. Testing get reviews for Product 29...');
  try {
    const response = await fetch(`${baseUrl}/api/review?productId=29`);
    console.log(`Status: ${response.status}`);
    const data = await response.text();
    console.log(`Response: ${data}\n`);
  } catch (error) {
    console.error(`Error: ${error.message}\n`);
  }
}

console.log('Note: Untuk test yang lengkap, jalankan aplikasi dengan npm run dev');
console.log('dan buka browser untuk melihat console.log di frontend.\n');

// Jika ada fetch (Node 18+)
if (typeof fetch !== 'undefined') {
  testReviewAPI();
} else {
  console.log('Fetch tidak tersedia. Gunakan browser atau Node 18+ untuk menjalankan test ini.');
}
