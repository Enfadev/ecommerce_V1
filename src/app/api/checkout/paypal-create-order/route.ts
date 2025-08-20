import { NextRequest, NextResponse } from 'next/server';

// Ganti dengan client ID dan secret Anda, atau gunakan env variable
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;
const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com';

async function getAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const { total, currency = 'USD' } = await req.json();
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
    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: 400 });
    }
    return NextResponse.json({ id: data.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
