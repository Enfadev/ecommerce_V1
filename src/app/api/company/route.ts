import { NextResponse } from "next/server";
import { getSystemSettingsWithFallback } from "@/lib/system-settings";

export async function GET(request: Request) {
  try {
    const settings = await getSystemSettingsWithFallback();

    const host = request.headers.get("host") || "localhost:3000";
    const proto = request.headers.get("x-forwarded-proto") || request.headers.get("x-forwarded-protocol") || "http";
    const origin = `${proto}://${host}`;

    const rawLogo = settings.logoUrl || null;
    const logoUrl = rawLogo ? (rawLogo.startsWith("http") ? rawLogo : `${origin}${rawLogo.startsWith("/") ? "" : "/"}${rawLogo}`) : null;

    const companyInfo = {
      name: settings.storeName,
      address: settings.officeAddress || "123 Business Street, City, State 12345",
      phone: settings.phoneNumber || "+1 (555) 123-4567",
      email: settings.contactEmail,
      website: host,
      logoUrl,
    };

    return NextResponse.json(companyInfo);
  } catch (error) {
    console.error("Error fetching company info:", error);

    const host = request.headers.get("host") || "localhost:3000";
    const proto = request.headers.get("x-forwarded-proto") || request.headers.get("x-forwarded-protocol") || "http";
    const origin = `${proto}://${host}`;

    return NextResponse.json({
      name: "E-Commerce Store",
      address: "123 Business Street, New York, NY 10001",
      phone: "+1 (555) 123-4567",
      email: "info@ecommerce.com",
      website: host,
      logoUrl: `${origin}/logo.svg`,
    });
  }
}
