import AdminContactPageEditor from "@/components/AdminContactPageEditor";

export default function EditContactPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Contact Page</h1>
        <p className="text-muted-foreground">
          Manage and edit the content of your contact page
        </p>
      </div>
      <AdminContactPageEditor />
    </div>
  );
}
