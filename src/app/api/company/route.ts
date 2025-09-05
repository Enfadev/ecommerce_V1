import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // You can modify this to fetch from database or environment variables
    const companyInfo = {
      name: process.env.COMPANY_NAME || "E-Commerce Store",
      address: process.env.COMPANY_ADDRESS || "123 Business Street, New York, NY 10001",
      phone: process.env.COMPANY_PHONE || "+1 (555) 123-4567",
      email: process.env.COMPANY_EMAIL || "info@ecommerce.com",
      website: process.env.COMPANY_WEBSITE || "www.ecommerce.com"
    };

    return NextResponse.json(companyInfo);
  } catch (error) {
    console.error('Error fetching company info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company information' },
      { status: 500 }
    );
  }
}
