"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";

interface EventItem {
  id: number;
  title: string;
  description: string;
  period: string;
  status: string;
  type: string;
  icon: string;
  prize: string;
  participants: string;
  bgGradient: string;
}

interface EventCategory {
  name: string;
  icon: string;
  color: string;
  description: string;
}

interface EventPageData {
  id: number;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  activeEvents: EventItem[];
  upcomingEvents: EventItem[];
  pastEvents: EventItem[];
  eventCategories: EventCategory[];
}

export default function AdminEventPageEditor() {
  const [data, setData] = useState<EventPageData>({
    id: 0,
    heroTitle: "Events & Promotions",
    heroSubtitle: "Latest Events",
    heroDescription: "Join our exciting events and promotions",
    activeEvents: [],
    upcomingEvents: [],
    pastEvents: [],
    eventCategories: [],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEventPageData();
  }, []);

  const fetchEventPageData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/event-page");
      if (res.ok) {
        const pageData = await res.json();
        if (pageData) {
          setData(pageData);
        }
      }
    } catch (error) {
      console.error("Error fetching event page data:", error);
      toast.error("Failed to load event page data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = data.id ? "PUT" : "POST";
      const res = await fetch("/api/event-page", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const savedData = await res.json();
        setData(savedData);
        toast.success("Event page updated successfully!");
      } else {
        toast.error("Failed to save event page");
      }
    } catch (error) {
      console.error("Error saving event page:", error);
      toast.error("Failed to save event page");
    } finally {
      setSaving(false);
    }
  };

  const addEvent = (eventType: "activeEvents" | "upcomingEvents" | "pastEvents") => {
    const newEvent: EventItem = {
      id: Date.now(),
      title: "New Event",
      description: "Event description",
      period: "Date range",
      status: "Active",
      type: "Sale",
      icon: "Gift",
      prize: "Prize description",
      participants: "0",
      bgGradient: "from-blue-500 to-purple-500",
    };
    setData({ ...data, [eventType]: [...data[eventType], newEvent] });
  };

  const removeEvent = (eventType: "activeEvents" | "upcomingEvents" | "pastEvents", index: number) => {
    const newEvents = data[eventType].filter((_, i) => i !== index);
    setData({ ...data, [eventType]: newEvents });
  };

  const updateEvent = (
    eventType: "activeEvents" | "upcomingEvents" | "pastEvents",
    index: number,
    field: keyof EventItem,
    value: string | number
  ) => {
    const newEvents = [...data[eventType]];
    newEvents[index] = { ...newEvents[index], [field]: value };
    setData({ ...data, [eventType]: newEvents });
  };

  const addEventCategory = () => {
    const newCategory: EventCategory = {
      name: "New Category",
      icon: "Calendar",
      color: "blue",
      description: "Category description",
    };
    setData({ ...data, eventCategories: [...data.eventCategories, newCategory] });
  };

  const removeEventCategory = (index: number) => {
    const newCategories = data.eventCategories.filter((_, i) => i !== index);
    setData({ ...data, eventCategories: newCategories });
  };

  const updateEventCategory = (index: number, field: keyof EventCategory, value: string) => {
    const newCategories = [...data.eventCategories];
    newCategories[index] = { ...newCategories[index], [field]: value };
    setData({ ...data, eventCategories: newCategories });
  };

  const renderEventSection = (
    title: string,
    eventType: "activeEvents" | "upcomingEvents" | "pastEvents",
    events: EventItem[],
    borderColor: string
  ) => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          <Button onClick={() => addEvent(eventType)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event, index) => (
          <Card key={index} className={`border-l-4 ${borderColor}`}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Event {index + 1}</h4>
                <Button variant="outline" size="sm" onClick={() => removeEvent(eventType, index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Event title"
                value={event.title}
                onChange={(e) => updateEvent(eventType, index, "title", e.target.value)}
              />
              <Input
                placeholder="Event period"
                value={event.period}
                onChange={(e) => updateEvent(eventType, index, "period", e.target.value)}
              />
              <Input
                placeholder="Status"
                value={event.status}
                onChange={(e) => updateEvent(eventType, index, "status", e.target.value)}
              />
              <Input
                placeholder="Event type"
                value={event.type}
                onChange={(e) => updateEvent(eventType, index, "type", e.target.value)}
              />
              <Input
                placeholder="Icon name"
                value={event.icon}
                onChange={(e) => updateEvent(eventType, index, "icon", e.target.value)}
              />
              <Input
                placeholder="Prize/Benefit"
                value={event.prize}
                onChange={(e) => updateEvent(eventType, index, "prize", e.target.value)}
              />
              <Input
                placeholder="Participants count"
                value={event.participants}
                onChange={(e) => updateEvent(eventType, index, "participants", e.target.value)}
              />
              <Input
                placeholder="Background gradient"
                value={event.bgGradient}
                onChange={(e) => updateEvent(eventType, index, "bgGradient", e.target.value)}
              />
              <div className="md:col-span-2">
                <Textarea
                  placeholder="Event description"
                  value={event.description}
                  onChange={(e) => updateEvent(eventType, index, "description", e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Event Page Editor</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Hero Title</label>
            <Input
              value={data.heroTitle}
              onChange={(e) => setData({ ...data, heroTitle: e.target.value })}
              placeholder="Event page title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
            <Input
              value={data.heroSubtitle}
              onChange={(e) => setData({ ...data, heroSubtitle: e.target.value })}
              placeholder="Event page subtitle"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Hero Description</label>
            <Textarea
              value={data.heroDescription}
              onChange={(e) => setData({ ...data, heroDescription: e.target.value })}
              placeholder="Event page description"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Active Events */}
      {renderEventSection("Active Events", "activeEvents", data.activeEvents, "border-green-500")}

      {/* Upcoming Events */}
      {renderEventSection("Upcoming Events", "upcomingEvents", data.upcomingEvents, "border-blue-500")}

      {/* Past Events */}
      {renderEventSection("Past Events", "pastEvents", data.pastEvents, "border-gray-500")}

      {/* Event Categories */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Event Categories</CardTitle>
            <Button onClick={addEventCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.eventCategories.map((category, index) => (
            <Card key={index} className="border-l-4 border-purple-500">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Category {index + 1}</h4>
                  <Button variant="outline" size="sm" onClick={() => removeEventCategory(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Category name"
                  value={category.name}
                  onChange={(e) => updateEventCategory(index, "name", e.target.value)}
                />
                <Input
                  placeholder="Icon name"
                  value={category.icon}
                  onChange={(e) => updateEventCategory(index, "icon", e.target.value)}
                />
                <Input
                  placeholder="Color theme"
                  value={category.color}
                  onChange={(e) => updateEventCategory(index, "color", e.target.value)}
                />
                <div className="md:col-span-3">
                  <Textarea
                    placeholder="Category description"
                    value={category.description}
                    onChange={(e) => updateEventCategory(index, "description", e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
