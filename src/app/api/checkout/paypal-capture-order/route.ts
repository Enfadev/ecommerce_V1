import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';

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
    if (await isAdminRequest(req)) {
      return NextResponse.json({ error: 'Admin cannot access checkout features' }, { status: 403 });
    }

    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      console.error('PayPal credentials missing:', {
        clientId: !!PAYPAL_CLIENT_ID,
        clientSecret: !!PAYPAL_CLIENT_SECRET
      });
      return NextResponse.json({ 
        error: 'PayPal is not properly configured on the server' 
      }, { status: 500 });
    }

    const { orderID } = await req.json();
    if (!orderID) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }
    
    const accessToken = await getAccessToken();
    const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    const data = await res.json();
    if (!res.ok) {
      console.error('PayPal capture failed:', {
        status: res.status,
        statusText: res.statusText,
        data
      });
      return NextResponse.json({ error: data }, { status: 400 });
    }
    return NextResponse.json({ data });
  } catch (error) {
    console.error('PayPal capture error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
