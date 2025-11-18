"use client";

interface FormProgressProps {
  completionPercentage: number;
}

export function FormProgress({ completionPercentage }: FormProgressProps) {
  return (
    <div className="mt-4 p-4 bg-card border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Form Completion</span>
        <span className="text-sm text-muted-foreground">{completionPercentage}% complete</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div className={`h-2 rounded-full transition-all duration-300 ${completionPercentage === 100 ? "bg-green-500" : "bg-primary"}`} style={{ width: `${completionPercentage}%` }}></div>
      </div>
      {completionPercentage === 100 && <p className="text-green-600 text-sm mt-2 flex items-center gap-1">✅ All required fields completed! You can now place your order.</p>}
    </div>
  );
}
