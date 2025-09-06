import { NextResponse } from 'next/server';
import { getSystemSettingsWithFallback } from '@/lib/system-settings';

export async function GET(request: Request) {
  try {
    const settings = await getSystemSettingsWithFallback();
    
    const host = request.headers.get('host') || 'localhost:3000';
    
    const companyInfo = {
      name: settings.storeName,
      address: settings.officeAddress || "123 Business Street, City, State 12345",
      phone: settings.phoneNumber || "+1 (555) 123-4567", 
      email: settings.contactEmail,
      website: host
    };

    return NextResponse.json(companyInfo);
  } catch (error) {
    console.error('Error fetching company info:', error);
    
    const host = request.headers.get('host') || 'localhost:3000';
    
    return NextResponse.json({
      name: "E-Commerce Store",
      address: "123 Business Street, New York, NY 10001",
      phone: "+1 (555) 123-4567",
      email: "info@ecommerce.com",
      website: host
    });
  }
}
