import AdminAboutPageEditor from "@/components/AdminAboutPageEditor";

export default function EditAboutPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit About Page</h1>
        <p className="text-muted-foreground">
          Manage and edit the content of your about page
        </p>
      </div>
      <AdminAboutPageEditor />
    </div>
  );
}
