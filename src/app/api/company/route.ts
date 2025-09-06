import { NextResponse } from 'next/server';
import { getSystemSettingsWithFallback } from '@/lib/system-settings';

export async function GET() {
  try {
    // Fetch company info from system settings database
    const settings = await getSystemSettingsWithFallback();
    
    const companyInfo = {
      name: settings.storeName,
      address: settings.officeAddress || "123 Business Street, City, State 12345",
      phone: settings.phoneNumber || "+1 (555) 123-4567", 
      email: settings.contactEmail,
      website: `www.${settings.storeName.toLowerCase().replace(/\s+/g, '')}.com`
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
