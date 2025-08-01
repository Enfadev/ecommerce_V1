import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning" | "info";
  onClose?: () => void;
  className?: string;
}

export function Toast({ title, description, variant = "default", onClose, className }: ToastProps) {
  const variants = {
    default: "bg-gray-900 border-gray-700 text-gray-100",
    success: "bg-green-900/90 border-green-700 text-green-100",
    error: "bg-red-900/90 border-red-700 text-red-100",
    warning: "bg-yellow-900/90 border-yellow-700 text-yellow-100",
    info: "bg-blue-900/90 border-blue-700 text-blue-100",
  };

  const icons = {
    default: null,
    success: <CheckCircle className="h-4 w-4" />,
    error: <AlertCircle className="h-4 w-4" />,
    warning: <AlertCircle className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />,
  };

  return (
    <div className={cn("fixed top-4 right-4 z-50 w-full max-w-sm rounded-lg border p-4 shadow-lg transition-all duration-300", variants[variant], className)}>
      <div className="flex items-start gap-3">
        {icons[variant] && <div className="flex-shrink-0 mt-0.5">{icons[variant]}</div>}
        <div className="flex-1">
          {title && <div className="font-semibold text-sm mb-1">{title}</div>}
          {description && <div className="text-sm opacity-90">{description}</div>}
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" className="flex-shrink-0 h-auto p-1 hover:bg-white/10" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
