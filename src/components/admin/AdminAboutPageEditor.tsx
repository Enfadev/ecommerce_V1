"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Save, Plus, Trash2, Globe, Info } from "lucide-react";
import SeoSettingsCard from "@/components/admin/SeoSettingsCard";

interface CompanyValue {
  icon: string;
  title: string;
  description: string;
}

interface Statistic {
  label: string;
  value: string;
  icon: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
}

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

interface AboutPageData {
  id: number;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  companyStory: string;
  mission: string;
  vision: string;
  values: CompanyValue[];
  statistics: Statistic[];
  features: Feature[];
  teamMembers: TeamMember[];
  timeline: TimelineEvent[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
  noindex?: boolean;
}

export default function AdminAboutPageEditor() {
  const [data, setData] = useState<AboutPageData>({
    id: 0,
    heroTitle: "About Us",
    heroSubtitle: "Our Story",
    heroDescription: "Learn more about our company and mission",
    companyStory: "",
    mission: "",
    vision: "",
    values: [],
    statistics: [],
    features: [],
    teamMembers: [],
    timeline: [],
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImageUrl: "",
    canonicalUrl: "",
    noindex: false,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAboutPageData();
  }, []);

  const fetchAboutPageData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/about-page");
      if (res.ok) {
        const pageData = await res.json();
        if (pageData) {
          setData({
            ...pageData,
            metaTitle: pageData.metaTitle || "",
            metaDescription: pageData.metaDescription || "",
            metaKeywords: pageData.metaKeywords || "",
            ogTitle: pageData.ogTitle || "",
            ogDescription: pageData.ogDescription || "",
            ogImageUrl: pageData.ogImageUrl || "",
            canonicalUrl: pageData.canonicalUrl || "",
            noindex: pageData.noindex || false,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching about page data:", error);
      toast.error("Failed to load about page data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = data.id ? "PUT" : "POST";
      const res = await fetch("/api/about-page", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const savedData = await res.json();
        setData(savedData);
        toast.success("About page updated successfully!");
      } else {
        toast.error("Failed to save about page");
      }
    } catch (error) {
      console.error("Error saving about page:", error);
      toast.error("Failed to save about page");
    } finally {
      setSaving(false);
    }
  };

  const addValue = () => {
    const newValue: CompanyValue = {
      icon: "Heart",
      title: "New Value",
      description: "Value description",
    };
    setData({ ...data, values: [...data.values, newValue] });
  };

  const removeValue = (index: number) => {
    const newValues = data.values.filter((_, i) => i !== index);
    setData({ ...data, values: newValues });
  };

  const updateValue = (index: number, field: keyof CompanyValue, value: string) => {
    const newValues = [...data.values];
    newValues[index] = { ...newValues[index], [field]: value };
    setData({ ...data, values: newValues });
  };

  const addStatistic = () => {
    const newStat: Statistic = {
      label: "New Statistic",
      value: "100+",
      icon: "Users",
    };
    setData({ ...data, statistics: [...data.statistics, newStat] });
  };

  const removeStatistic = (index: number) => {
    const newStats = data.statistics.filter((_, i) => i !== index);
    setData({ ...data, statistics: newStats });
  };

  const updateStatistic = (index: number, field: keyof Statistic, value: string) => {
    const newStats = [...data.statistics];
    newStats[index] = { ...newStats[index], [field]: value };
    setData({ ...data, statistics: newStats });
  };

  const addFeature = () => {
    const newFeature: Feature = {
      icon: "Shield",
      title: "New Feature",
      description: "Feature description",
    };
    setData({ ...data, features: [...data.features, newFeature] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = data.features.filter((_, i) => i !== index);
    setData({ ...data, features: newFeatures });
  };

  const updateFeature = (index: number, field: keyof Feature, value: string) => {
    const newFeatures = [...data.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setData({ ...data, features: newFeatures });
  };

  const addTeamMember = () => {
    const newMember: TeamMember = {
      name: "New Member",
      role: "Position",
      image: "/team-placeholder.jpg",
      description: "Member description",
    };
    setData({ ...data, teamMembers: [...data.teamMembers, newMember] });
  };

  const removeTeamMember = (index: number) => {
    const newMembers = data.teamMembers.filter((_, i) => i !== index);
    setData({ ...data, teamMembers: newMembers });
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    const newMembers = [...data.teamMembers];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setData({ ...data, teamMembers: newMembers });
  };

  const addTimelineEvent = () => {
    const newEvent: TimelineEvent = {
      year: "2024",
      title: "New Milestone",
      description: "Milestone description",
    };
    setData({ ...data, timeline: [...data.timeline, newEvent] });
  };

  const removeTimelineEvent = (index: number) => {
    const newEvents = data.timeline.filter((_, i) => i !== index);
    setData({ ...data, timeline: newEvents });
  };

  const updateTimelineEvent = (index: number, field: keyof TimelineEvent, value: string) => {
    const newEvents = [...data.timeline];
    newEvents[index] = { ...newEvents[index], [field]: value };
    setData({ ...data, timeline: newEvents });
  };

  const handleSeoChange = (field: keyof AboutPageData, value: string | boolean) => {
    setData({ ...data, [field]: value });
  };

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
        <h1 className="text-2xl font-bold">About Page Editor</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            SEO Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Hero Title</label>
                <Input value={data.heroTitle} onChange={(e) => setData({ ...data, heroTitle: e.target.value })} placeholder="About page title" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
                <Input value={data.heroSubtitle} onChange={(e) => setData({ ...data, heroSubtitle: e.target.value })} placeholder="About page subtitle" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hero Description</label>
                <Textarea value={data.heroDescription} onChange={(e) => setData({ ...data, heroDescription: e.target.value })} placeholder="About page description" rows={3} />
              </div>
            </CardContent>
          </Card>

          {/* Company Story, Mission, Vision */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Company Story</label>
                <Textarea value={data.companyStory} onChange={(e) => setData({ ...data, companyStory: e.target.value })} placeholder="Tell your company story..." rows={5} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mission</label>
                <Textarea value={data.mission} onChange={(e) => setData({ ...data, mission: e.target.value })} placeholder="Company mission statement..." rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Vision</label>
                <Textarea value={data.vision} onChange={(e) => setData({ ...data, vision: e.target.value })} placeholder="Company vision statement..." rows={3} />
              </div>
            </CardContent>
          </Card>

          {/* Company Values */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Company Values</CardTitle>
                <Button onClick={addValue}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Value
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.values.map((value, index) => (
                <Card key={index} className="border-l-4 border-blue-500">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Value {index + 1}</h4>
                      <Button variant="outline" size="sm" onClick={() => removeValue(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Icon name" value={value.icon} onChange={(e) => updateValue(index, "icon", e.target.value)} />
                    <Input placeholder="Value title" value={value.title} onChange={(e) => updateValue(index, "title", e.target.value)} />
                    <div className="md:col-span-2">
                      <Textarea placeholder="Value description" value={value.description} onChange={(e) => updateValue(index, "description", e.target.value)} rows={2} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Statistics</CardTitle>
                <Button onClick={addStatistic}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Statistic
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.statistics.map((stat, index) => (
                <Card key={index} className="border-l-4 border-green-500">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Statistic {index + 1}</h4>
                      <Button variant="outline" size="sm" onClick={() => removeStatistic(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input placeholder="Statistic label" value={stat.label} onChange={(e) => updateStatistic(index, "label", e.target.value)} />
                    <Input placeholder="Statistic value" value={stat.value} onChange={(e) => updateStatistic(index, "value", e.target.value)} />
                    <Input placeholder="Icon name" value={stat.icon} onChange={(e) => updateStatistic(index, "icon", e.target.value)} />
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Features</CardTitle>
                <Button onClick={addFeature}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.features.map((feature, index) => (
                <Card key={index} className="border-l-4 border-orange-500">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Feature {index + 1}</h4>
                      <Button variant="outline" size="sm" onClick={() => removeFeature(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Icon name" value={feature.icon} onChange={(e) => updateFeature(index, "icon", e.target.value)} />
                    <Input placeholder="Feature title" value={feature.title} onChange={(e) => updateFeature(index, "title", e.target.value)} />
                    <div className="md:col-span-2">
                      <Textarea placeholder="Feature description" value={feature.description} onChange={(e) => updateFeature(index, "description", e.target.value)} rows={2} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Team Members</CardTitle>
                <Button onClick={addTeamMember}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.teamMembers.map((member, index) => (
                <Card key={index} className="border-l-4 border-purple-500">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Team Member {index + 1}</h4>
                      <Button variant="outline" size="sm" onClick={() => removeTeamMember(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input placeholder="Member name" value={member.name} onChange={(e) => updateTeamMember(index, "name", e.target.value)} />
                    <Input placeholder="Role/Position" value={member.role} onChange={(e) => updateTeamMember(index, "role", e.target.value)} />
                    <Input placeholder="Image URL" value={member.image} onChange={(e) => updateTeamMember(index, "image", e.target.value)} />
                    <div className="md:col-span-3">
                      <Textarea placeholder="Member description" value={member.description} onChange={(e) => updateTeamMember(index, "description", e.target.value)} rows={2} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Company Timeline</CardTitle>
                <Button onClick={addTimelineEvent}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Timeline Event
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.timeline.map((event, index) => (
                <Card key={index} className="border-l-4 border-yellow-500">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Timeline Event {index + 1}</h4>
                      <Button variant="outline" size="sm" onClick={() => removeTimelineEvent(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Year" value={event.year} onChange={(e) => updateTimelineEvent(index, "year", e.target.value)} />
                    <Input placeholder="Event title" value={event.title} onChange={(e) => updateTimelineEvent(index, "title", e.target.value)} />
                    <div className="md:col-span-2">
                      <Textarea placeholder="Event description" value={event.description} onChange={(e) => updateTimelineEvent(index, "description", e.target.value)} rows={2} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <SeoSettingsCard
            data={{
              metaTitle: data.metaTitle,
              metaDescription: data.metaDescription,
              metaKeywords: data.metaKeywords,
              ogTitle: data.ogTitle,
              ogDescription: data.ogDescription,
              ogImageUrl: data.ogImageUrl,
              canonicalUrl: data.canonicalUrl,
              noindex: data.noindex,
            }}
            onChange={handleSeoChange}
            pageName="About"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
