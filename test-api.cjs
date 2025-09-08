const jwt = require('jsonwebtoken');

// Create a test JWT token for user@demo.com
const payload = {
  email: 'user@demo.com',
  role: 'USER'
};

const token = jwt.sign(payload, 'your-secret-key', { expiresIn: '1d' });
console.log('Test JWT Token:', token);

// Test API call
const testAPI = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/review/eligible-orders?productId=30', {
      headers: {
        'Cookie': `auth-token=${token}`
      }
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
};

// Don't run the API test in Node.js since fetch might not be available
console.log('Use this token in browser cookies for testing');
