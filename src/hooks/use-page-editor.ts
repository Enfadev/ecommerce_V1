import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface UsePageEditorOptions<T> {
  apiEndpoint: string;
  initialData: T;
  successMessage?: string;
}

export function usePageEditor<T extends { id: number }>({ apiEndpoint, initialData, successMessage = "Page updated successfully!" }: UsePageEditorOptions<T>) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiEndpoint);
      if (res.ok) {
        const pageData = await res.json();
        if (pageData) {
          setData(pageData);
        }
      }
    } catch (error) {
      console.error(`Error fetching data from ${apiEndpoint}:`, error);
      toast.error("Failed to load page data");
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const saveData = async () => {
    setSaving(true);
    try {
      const method = data.id ? "PUT" : "POST";
      const res = await fetch(apiEndpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const savedData = await res.json();
        setData(savedData);
        toast.success(successMessage);
        return true;
      } else {
        toast.error("Failed to save page");
        return false;
      }
    } catch (error) {
      console.error(`Error saving data to ${apiEndpoint}:`, error);
      toast.error("Failed to save page");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    data,
    setData,
    loading,
    saving,
    saveData,
    refetch: fetchData,
  };
}
