import { NextRequest, NextResponse } from 'next/server';

// Ganti dengan client ID dan secret Anda, atau gunakan env variable
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;
const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com';

async function getAccessToken() {
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    
    if (!res.ok) {
      const errorData = await res.text();
      console.error('PayPal auth error:', errorData);
      throw new Error(`PayPal authentication failed: ${res.status}`);
    }
    
    const data = await res.json();
    if (!data.access_token) {
      console.error('PayPal auth response missing access_token:', data);
      throw new Error('PayPal authentication failed: no access token received');
    }
    
    return data.access_token;
  } catch (error) {
    console.error('Error getting PayPal access token:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    // Validate environment variables
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      console.error('PayPal credentials missing:', {
        clientId: !!PAYPAL_CLIENT_ID,
        clientSecret: !!PAYPAL_CLIENT_SECRET
      });
      return NextResponse.json({ 
        error: 'PayPal is not properly configured on the server' 
      }, { status: 500 });
    }
    
    const { total, currency = 'USD' } = await req.json();
    if (typeof total !== 'number' || isNaN(total) || total <= 0) {
      return NextResponse.json({ error: 'Invalid total amount' }, { status: 400 });
    }
    
    const accessToken = await getAccessToken();
    const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: total.toFixed(2),
            },
          },
        ],
      }),
    });
    
    const data = await res.json();
    if (!res.ok || !data.id) {
      let errorMsg = 'Failed to create PayPal order';
      console.error('PayPal order creation failed:', {
        status: res.status,
        statusText: res.statusText,
        data
      });
      
      if (data && typeof data === 'object') {
        if (data.message) errorMsg = data.message;
        else if (data.error_description) errorMsg = data.error_description;
        else if (data.error && typeof data.error === 'string') errorMsg = data.error;
        else if (data.details && Array.isArray(data.details) && data.details[0]?.issue) errorMsg = data.details[0].issue;
        else errorMsg = JSON.stringify(data);
      }
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }
    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.error('PayPal create order error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
