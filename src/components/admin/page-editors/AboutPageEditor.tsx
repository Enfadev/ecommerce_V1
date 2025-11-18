"use client";

import { Loader2, Info, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { HeroSectionEditor } from "../page-editor/HeroSectionEditor";
import { SaveButton } from "../page-editor/SaveButton";
import { ValuesSection } from "../about-page/ValuesSection";
import { StatisticsSection } from "../about-page/StatisticsSection";
import { FeaturesSection } from "../about-page/FeaturesSection";
import { TeamSection } from "../about-page/TeamSection";
import { TimelineSection } from "../about-page/TimelineSection";
import SeoSettingsCard from "@/components/admin/shared/SeoSettingsCard";
import { usePageEditor } from "@/hooks/use-page-editor";

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

const initialData: AboutPageData = {
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
};

export default function AdminAboutPageEditor() {
  const { data, setData, loading, saving, saveData } = usePageEditor<AboutPageData>({
    apiEndpoint: "/api/about-page",
    initialData,
    successMessage: "About page updated successfully!",
  });

  const addValue = () => {
    setData({ ...data, values: [...data.values, { icon: "Heart", title: "New Value", description: "Value description" }] });
  };

  const removeValue = (index: number) => {
    setData({ ...data, values: data.values.filter((_, i) => i !== index) });
  };

  const updateValue = (index: number, field: keyof CompanyValue, value: string) => {
    const newValues = [...data.values];
    newValues[index] = { ...newValues[index], [field]: value };
    setData({ ...data, values: newValues });
  };

  const addStatistic = () => {
    setData({ ...data, statistics: [...data.statistics, { label: "New Statistic", value: "100+", icon: "Users" }] });
  };

  const removeStatistic = (index: number) => {
    setData({ ...data, statistics: data.statistics.filter((_, i) => i !== index) });
  };

  const updateStatistic = (index: number, field: keyof Statistic, value: string) => {
    const newStats = [...data.statistics];
    newStats[index] = { ...newStats[index], [field]: value };
    setData({ ...data, statistics: newStats });
  };

  const addFeature = () => {
    setData({ ...data, features: [...data.features, { icon: "Shield", title: "New Feature", description: "Feature description" }] });
  };

  const removeFeature = (index: number) => {
    setData({ ...data, features: data.features.filter((_, i) => i !== index) });
  };

  const updateFeature = (index: number, field: keyof Feature, value: string) => {
    const newFeatures = [...data.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setData({ ...data, features: newFeatures });
  };

  const addTeamMember = () => {
    setData({ ...data, teamMembers: [...data.teamMembers, { name: "New Member", role: "Position", image: "/team-placeholder.jpg", description: "Member description" }] });
  };

  const removeTeamMember = (index: number) => {
    setData({ ...data, teamMembers: data.teamMembers.filter((_, i) => i !== index) });
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    const newMembers = [...data.teamMembers];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setData({ ...data, teamMembers: newMembers });
  };

  const addTimelineEvent = () => {
    setData({ ...data, timeline: [...data.timeline, { year: "2024", title: "New Milestone", description: "Milestone description" }] });
  };

  const removeTimelineEvent = (index: number) => {
    setData({ ...data, timeline: data.timeline.filter((_, i) => i !== index) });
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
        <SaveButton onClick={saveData} saving={saving} />
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
          <HeroSectionEditor
            title={data.heroTitle}
            subtitle={data.heroSubtitle}
            description={data.heroDescription}
            onTitleChange={(v: string) => setData({ ...data, heroTitle: v })}
            onSubtitleChange={(v: string) => setData({ ...data, heroSubtitle: v })}
            onDescriptionChange={(v: string) => setData({ ...data, heroDescription: v })}
          />

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

          <ValuesSection values={data.values} onAdd={addValue} onRemove={removeValue} onUpdate={updateValue} />

          <StatisticsSection statistics={data.statistics} onAdd={addStatistic} onRemove={removeStatistic} onUpdate={updateStatistic} />

          <FeaturesSection features={data.features} onAdd={addFeature} onRemove={removeFeature} onUpdate={updateFeature} />

          <TeamSection teamMembers={data.teamMembers} onAdd={addTeamMember} onRemove={removeTeamMember} onUpdate={updateTeamMember} />

          <TimelineSection timeline={data.timeline} onAdd={addTimelineEvent} onRemove={removeTimelineEvent} onUpdate={updateTimelineEvent} />
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
