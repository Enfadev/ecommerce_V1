import { NextRequest, NextResponse } from 'next/server';

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
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      console.error('PayPal credentials missing:', {
        clientId: !!PAYPAL_CLIENT_ID,
        clientSecret: !!PAYPAL_CLIENT_SECRET
      });
      return NextResponse.json({ 
        error: 'PayPal is not properly configured on the server' 
      }, { status: 500 });
    }
    
    const requestBody = await req.json();
    console.log('PayPal create order request:', requestBody);
    
    const { total, currency = 'USD' } = requestBody;
    if (typeof total !== 'number' || isNaN(total) || total <= 0) {
      console.error('Invalid total amount:', total);
      return NextResponse.json({ error: 'Invalid total amount' }, { status: 400 });
    }
    
    const accessToken = await getAccessToken();
    
    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: total.toFixed(2),
          },
        },
      ],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout`,
        brand_name: 'Your Store',
        landing_page: 'LOGIN',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW'
      }
    };
    
    console.log('PayPal order payload:', JSON.stringify(orderPayload, null, 2));
    
    const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderPayload),
    });
    
    const data = await res.json();
    console.log('PayPal API response:', {
      status: res.status,
      statusText: res.statusText,
      data: JSON.stringify(data, null, 2)
    });
    
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
