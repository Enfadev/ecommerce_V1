import { Metadata } from "next";
import { prisma } from "@/lib/database";
import { generatePageMetadata } from "@/lib/utils";

export const dynamic = "force-dynamic";

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
