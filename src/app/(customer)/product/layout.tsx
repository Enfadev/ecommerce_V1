import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { generatePageMetadata } from "@/lib/seo-utils";

// Generate dynamic metadata for product page
export async function generateMetadata(): Promise<Metadata> {
  const productPage = await prisma.productPage.findFirst();
  return generatePageMetadata({
    pageData: productPage,
    fallbackTitle: "Products",
    defaultPath: "/product",
  });
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}
