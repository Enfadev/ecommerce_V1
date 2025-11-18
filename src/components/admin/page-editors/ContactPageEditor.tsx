"use client";

import { Loader2, MessageCircle, Globe, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeroSectionEditor } from "../page-editor/HeroSectionEditor";
import { SaveButton } from "../page-editor/SaveButton";
import { ContactMethodsSection } from "../contact-page/ContactMethodsSection";
import { OfficeLocationsSection } from "../contact-page/OfficeLocationsSection";
import { BusinessHoursSection } from "../contact-page/BusinessHoursSection";
import { SocialMediaSection } from "../contact-page/SocialMediaSection";
import SeoSettingsCard from "@/components/admin/shared/SeoSettingsCard";
import { usePageEditor } from "@/hooks/usePageEditor";

interface ContactMethod {
  icon: string;
  title: string;
  subtitle: string;
  value: string;
  link: string;
  bgColor: string;
}

interface OfficeLocation {
  city: string;
  address: string;
  phone: string;
  isMain: boolean;
}

interface BusinessHour {
  day: string;
  hours: string;
  closed: boolean;
}

interface SocialMedia {
  name: string;
  link: string;
  icon: string;
  color: string;
}

interface ContactPageData {
  id: number;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  contactMethods: ContactMethod[];
  officeLocations: OfficeLocation[];
  businessHours: BusinessHour[];
  socialMedia: SocialMedia[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
  noindex?: boolean;
}

const initialData: ContactPageData = {
  id: 0,
  heroTitle: "",
  heroSubtitle: "",
  heroDescription: "",
  contactMethods: [],
  officeLocations: [],
  businessHours: [],
  socialMedia: [],
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  ogTitle: "",
  ogDescription: "",
  ogImageUrl: "",
  canonicalUrl: "",
  noindex: false,
};

export default function AdminContactPageEditor() {
  const { data, setData, loading, saving, saveData } = usePageEditor<ContactPageData>({
    apiEndpoint: "/api/contact-page",
    initialData,
    successMessage: "Contact page updated successfully!",
  });

  const addContactMethod = () => {
    setData({ ...data, contactMethods: [...data.contactMethods, { icon: "Phone", title: "", subtitle: "", value: "", link: "", bgColor: "bg-blue-500" }] });
  };

  const removeContactMethod = (index: number) => {
    setData({ ...data, contactMethods: data.contactMethods.filter((_, i) => i !== index) });
  };

  const updateContactMethod = (index: number, field: keyof ContactMethod, value: string) => {
    const newMethods = [...data.contactMethods];
    newMethods[index] = { ...newMethods[index], [field]: value };
    setData({ ...data, contactMethods: newMethods });
  };

  const addOfficeLocation = () => {
    setData({ ...data, officeLocations: [...data.officeLocations, { city: "", address: "", phone: "", isMain: false }] });
  };

  const removeOfficeLocation = (index: number) => {
    setData({ ...data, officeLocations: data.officeLocations.filter((_, i) => i !== index) });
  };

  const updateOfficeLocation = (index: number, field: keyof OfficeLocation, value: string | boolean) => {
    const newLocations = [...data.officeLocations];
    newLocations[index] = { ...newLocations[index], [field]: value };
    setData({ ...data, officeLocations: newLocations });
  };

  const addBusinessHour = () => {
    setData({ ...data, businessHours: [...data.businessHours, { day: "", hours: "", closed: false }] });
  };

  const removeBusinessHour = (index: number) => {
    setData({ ...data, businessHours: data.businessHours.filter((_, i) => i !== index) });
  };

  const updateBusinessHour = (index: number, field: keyof BusinessHour, value: string | boolean) => {
    const newHours = [...data.businessHours];
    newHours[index] = { ...newHours[index], [field]: value };
    setData({ ...data, businessHours: newHours });
  };

  const addSocialMedia = () => {
    setData({ ...data, socialMedia: [...data.socialMedia, { name: "", link: "", icon: "Facebook", color: "text-blue-600" }] });
  };

  const removeSocialMedia = (index: number) => {
    setData({ ...data, socialMedia: data.socialMedia.filter((_, i) => i !== index) });
  };

  const updateSocialMedia = (index: number, field: keyof SocialMedia, value: string) => {
    const newSocial = [...data.socialMedia];
    newSocial[index] = { ...newSocial[index], [field]: value };
    setData({ ...data, socialMedia: newSocial });
  };

  const handleSeoChange = (field: keyof ContactPageData, value: string | boolean) => {
    setData({ ...data, [field]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contact Page Editor</h1>
          <p className="text-muted-foreground">Manage contact page content and information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open("/contact", "_blank")}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <SaveButton onClick={saveData} saving={saving} />
        </div>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
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

          <ContactMethodsSection methods={data.contactMethods} onAdd={addContactMethod} onRemove={removeContactMethod} onUpdate={updateContactMethod} />

          <OfficeLocationsSection locations={data.officeLocations} onAdd={addOfficeLocation} onRemove={removeOfficeLocation} onUpdate={updateOfficeLocation} />

          <BusinessHoursSection businessHours={data.businessHours} onAdd={addBusinessHour} onRemove={removeBusinessHour} onUpdate={updateBusinessHour} />

          <SocialMediaSection socialMedia={data.socialMedia} onAdd={addSocialMedia} onRemove={removeSocialMedia} onUpdate={updateSocialMedia} />
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
            pageName="Contact"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
