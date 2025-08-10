import AdminEventPageEditor from "@/components/AdminEventPageEditor";

export default function EditEventsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Events Page</h1>
        <p className="text-muted-foreground">
          Manage and edit the content of your events page
        </p>
      </div>
      <AdminEventPageEditor />
    </div>
  );
}
