export default function GeneralSettings() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">General Settings</h1>
        <p className="text-muted-foreground">
          Configure general website settings and preferences
        </p>
      </div>
      
      <div className="bg-muted/50 border border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
        <h3 className="text-lg font-medium mb-2">General Settings</h3>
        <p className="text-muted-foreground">
          This section will contain general website settings like site name, logo, 
          SEO settings, email configuration, and other global preferences.
        </p>
      </div>
    </div>
  );
}
