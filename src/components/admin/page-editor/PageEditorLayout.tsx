"use client";

import { ReactNode } from "react";
import { Loader2, LucideIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SaveButton } from "./SaveButton";

interface Tab {
  value: string;
  label: string;
  icon: LucideIcon;
  content: ReactNode;
}

interface PageEditorLayoutProps {
  loading: boolean;
  saving: boolean;
  onSave: () => void | Promise<void>;
  tabs: Tab[];
  defaultTab?: string;
  title?: string;
}

/**
 * Unified layout wrapper for page editors
 * Provides consistent structure with tabs for content and SEO sections
 */
export function PageEditorLayout({ loading, saving, onSave, tabs, defaultTab = "content", title }: PageEditorLayoutProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin mr-3" />
        <span className="text-lg">Loading page data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{title}</h2>
          <SaveButton onClick={onSave} saving={saving} />
        </div>
      )}

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-6">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>

      {!title && (
        <div className="flex justify-end pt-4">
          <SaveButton onClick={onSave} saving={saving} />
        </div>
      )}
    </div>
  );
}
