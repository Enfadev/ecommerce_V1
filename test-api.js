// Test API endpoint
async function testCategoryAPI() {
  try {
    console.log('Testing /api/admin/categories endpoint...');
    
    const response = await fetch('http://localhost:3000/api/admin/categories');
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testCategoryAPI();
