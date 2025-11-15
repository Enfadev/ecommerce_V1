import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ReactNode } from "react";

interface ItemCardProps {
  title: string;
  borderColor?: string;
  onRemove: () => void;
  children: ReactNode;
}

export function ItemCard({ title, borderColor = "border-blue-500", onRemove, children }: ItemCardProps) {
  return (
    <Card className={`border-l-4 ${borderColor}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">{title}</h3>
          <Button variant="destructive" size="sm" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}
