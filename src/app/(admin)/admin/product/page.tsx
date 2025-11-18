import { Suspense } from "react";
import { ProductsWrapper } from "@/components/admin/products/ProductsWrapper";
import { getInitialProductsData } from "@/lib/actions";
import Loading from "./loading";

export const metadata = {
  title: "Product Management - Admin",
  description: "Manage all products in your e-commerce store",
};

export default async function AdminProductManagement() {
  const { products, stats } = await getInitialProductsData();

  return (
    <Suspense fallback={<Loading />}>
      <ProductsWrapper initialProducts={products} initialStats={stats} />
    </Suspense>
  );
}
