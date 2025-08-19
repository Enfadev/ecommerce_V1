import AdminProductPageEditor from "@/components/AdminProductPageEditor";

export default function EditProductsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Products Page</h1>
        <p className="text-muted-foreground">
          Manage and edit the content of your products page
        </p>
      </div>
      <AdminProductPageEditor />
    </div>
  );
}
