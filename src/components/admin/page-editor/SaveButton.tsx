import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";

interface SaveButtonProps {
  onClick: () => void;
  saving: boolean;
}

export function SaveButton({ onClick, saving }: SaveButtonProps) {
  return (
    <Button onClick={onClick} disabled={saving}>
      {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
      Save Changes
    </Button>
  );
}
