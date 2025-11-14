import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { generatePageMetadata } from "@/lib/seo-utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const contactPage = await prisma.contactPage.findFirst();
  return generatePageMetadata({
    pageData: contactPage,
    fallbackTitle: "Contact Us",
    defaultPath: "/contact",
  });
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
