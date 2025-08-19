import AdminHomePageEditor from "@/components/AdminHomePageEditor";

export default function EditHomePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Home Page</h1>
        <p className="text-muted-foreground">
          Manage and edit the content of your home page
        </p>
      </div>
      <AdminHomePageEditor />
    </div>
  );
}
