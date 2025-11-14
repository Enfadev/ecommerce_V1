"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Save, Globe, Plus, Trash2, Eye, MessageCircle } from "lucide-react";
import SeoSettingsCard from "@/components/admin/SeoSettingsCard";

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

export default function AdminContactPageEditor() {
  const [contactData, setContactData] = useState<ContactPageData>({
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
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContactData();
  }, []);

  const loadContactData = async () => {
    try {
      const response = await fetch("/api/contact-page");
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setContactData({
            id: data.id,
            heroTitle: data.heroTitle || "",
            heroSubtitle: data.heroSubtitle || "",
            heroDescription: data.heroDescription || "",
            contactMethods: data.contactMethods || [],
            officeLocations: data.officeLocations || [],
            businessHours: data.businessHours || [],
            socialMedia: data.socialMedia || [],
            metaTitle: data.metaTitle || "",
            metaDescription: data.metaDescription || "",
            metaKeywords: data.metaKeywords || "",
            ogTitle: data.ogTitle || "",
            ogDescription: data.ogDescription || "",
            ogImageUrl: data.ogImageUrl || "",
            canonicalUrl: data.canonicalUrl || "",
            noindex: data.noindex || false,
          });
        }
      }
    } catch (error) {
      console.error("Error loading contact data:", error);
      toast.error("Failed to load contact page data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/contact-page", {
        method: contactData.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      if (response.ok) {
        toast.success("Contact page updated successfully!");
        if (!contactData.id) {
          const result = await response.json();
          setContactData((prev) => ({ ...prev, id: result.id }));
        }
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving contact data:", error);
      toast.error("Failed to save contact page");
    } finally {
      setSaving(false);
    }
  };

  const addContactMethod = () => {
    setContactData((prev) => ({
      ...prev,
      contactMethods: [
        ...prev.contactMethods,
        {
          icon: "Phone",
          title: "",
          subtitle: "",
          value: "",
          link: "",
          bgColor: "bg-blue-500",
        },
      ],
    }));
  };

  const removeContactMethod = (index: number) => {
    setContactData((prev) => ({
      ...prev,
      contactMethods: prev.contactMethods.filter((_, i) => i !== index),
    }));
  };

  const updateContactMethod = (index: number, field: keyof ContactMethod, value: string) => {
    setContactData((prev) => ({
      ...prev,
      contactMethods: prev.contactMethods.map((method, i) => (i === index ? { ...method, [field]: value } : method)),
    }));
  };

  const addOfficeLocation = () => {
    setContactData((prev) => ({
      ...prev,
      officeLocations: [
        ...prev.officeLocations,
        {
          city: "",
          address: "",
          phone: "",
          isMain: false,
        },
      ],
    }));
  };

  const removeOfficeLocation = (index: number) => {
    setContactData((prev) => ({
      ...prev,
      officeLocations: prev.officeLocations.filter((_, i) => i !== index),
    }));
  };

  const updateOfficeLocation = (index: number, field: keyof OfficeLocation, value: string | boolean) => {
    setContactData((prev) => ({
      ...prev,
      officeLocations: prev.officeLocations.map((office, i) => (i === index ? { ...office, [field]: value } : office)),
    }));
  };

  const addBusinessHour = () => {
    setContactData((prev) => ({
      ...prev,
      businessHours: [
        ...prev.businessHours,
        {
          day: "",
          hours: "",
          closed: false,
        },
      ],
    }));
  };

  const removeBusinessHour = (index: number) => {
    setContactData((prev) => ({
      ...prev,
      businessHours: prev.businessHours.filter((_, i) => i !== index),
    }));
  };

  const updateBusinessHour = (index: number, field: keyof BusinessHour, value: string | boolean) => {
    setContactData((prev) => ({
      ...prev,
      businessHours: prev.businessHours.map((hour, i) => (i === index ? { ...hour, [field]: value } : hour)),
    }));
  };

  const addSocialMedia = () => {
    setContactData((prev) => ({
      ...prev,
      socialMedia: [
        ...prev.socialMedia,
        {
          name: "",
          link: "",
          icon: "Facebook",
          color: "text-blue-600",
        },
      ],
    }));
  };

  const removeSocialMedia = (index: number) => {
    setContactData((prev) => ({
      ...prev,
      socialMedia: prev.socialMedia.filter((_, i) => i !== index),
    }));
  };

  const updateSocialMedia = (index: number, field: keyof SocialMedia, value: string) => {
    setContactData((prev) => ({
      ...prev,
      socialMedia: prev.socialMedia.map((social, i) => (i === index ? { ...social, [field]: value } : social)),
    }));
  };

  const handleSeoChange = (field: keyof ContactPageData, value: string | boolean) => {
    setContactData((prev) => ({ ...prev, [field]: value }));
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
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
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
          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Hero Section
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Hero Title</label>
                <Input value={contactData.heroTitle} onChange={(e) => setContactData((prev) => ({ ...prev, heroTitle: e.target.value }))} placeholder="Enter hero title" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
                <Input value={contactData.heroSubtitle} onChange={(e) => setContactData((prev) => ({ ...prev, heroSubtitle: e.target.value }))} placeholder="Enter hero subtitle" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hero Description</label>
                <Textarea value={contactData.heroDescription} onChange={(e) => setContactData((prev) => ({ ...prev, heroDescription: e.target.value }))} placeholder="Enter hero description" rows={3} />
              </div>
            </CardContent>
          </Card>

          {/* Contact Methods */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Contact Methods</CardTitle>
                <Button onClick={addContactMethod} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Method
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contactData.contactMethods.map((method, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant="secondary">Method {index + 1}</Badge>
                      <Button variant="outline" size="sm" onClick={() => removeContactMethod(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <Input value={method.title} onChange={(e) => updateContactMethod(index, "title", e.target.value)} placeholder="e.g., Phone, WhatsApp" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Subtitle</label>
                        <Input value={method.subtitle} onChange={(e) => updateContactMethod(index, "subtitle", e.target.value)} placeholder="e.g., Monday - Friday, 08:00 - 17:00" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Value</label>
                        <Input value={method.value} onChange={(e) => updateContactMethod(index, "value", e.target.value)} placeholder="e.g., +62 21 1234 5678" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Link</label>
                        <Input value={method.link} onChange={(e) => updateContactMethod(index, "link", e.target.value)} placeholder="e.g., tel:+622112345678" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Icon</label>
                        <Input value={method.icon} onChange={(e) => updateContactMethod(index, "icon", e.target.value)} placeholder="e.g., Phone, Mail, MessageSquare" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Background Color</label>
                        <select value={method.bgColor} onChange={(e) => updateContactMethod(index, "bgColor", e.target.value)} className="w-full px-3 py-2 border rounded-md">
                          <option value="bg-blue-500">Blue</option>
                          <option value="bg-green-500">Green</option>
                          <option value="bg-purple-500">Purple</option>
                          <option value="bg-orange-500">Orange</option>
                          <option value="bg-red-500">Red</option>
                          <option value="bg-yellow-500">Yellow</option>
                        </select>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Office Locations */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Office Locations</CardTitle>
                <Button onClick={addOfficeLocation} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Location
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contactData.officeLocations.map((office, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant="secondary">Location {index + 1}</Badge>
                      <Button variant="outline" size="sm" onClick={() => removeOfficeLocation(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">City</label>
                        <Input value={office.city} onChange={(e) => updateOfficeLocation(index, "city", e.target.value)} placeholder="e.g., Jakarta" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone</label>
                        <Input value={office.phone} onChange={(e) => updateOfficeLocation(index, "phone", e.target.value)} placeholder="e.g., +62 21 1234 5678" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Address</label>
                        <Textarea value={office.address} onChange={(e) => updateOfficeLocation(index, "address", e.target.value)} placeholder="Enter full address" rows={2} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={office.isMain} onChange={(e) => updateOfficeLocation(index, "isMain", e.target.checked)} />
                          <span className="text-sm font-medium">Main Office (HQ)</span>
                        </label>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Business Hours */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Business Hours</CardTitle>
                <Button onClick={addBusinessHour} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Hours
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contactData.businessHours.map((hour, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant="secondary">Schedule {index + 1}</Badge>
                      <Button variant="outline" size="sm" onClick={() => removeBusinessHour(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Day</label>
                        <Input value={hour.day} onChange={(e) => updateBusinessHour(index, "day", e.target.value)} placeholder="e.g., Monday - Friday" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Hours</label>
                        <Input value={hour.hours} onChange={(e) => updateBusinessHour(index, "hours", e.target.value)} placeholder="e.g., 08:00 - 17:00" disabled={hour.closed} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={hour.closed} onChange={(e) => updateBusinessHour(index, "closed", e.target.checked)} />
                          <span className="text-sm font-medium">Closed</span>
                        </label>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Social Media</CardTitle>
                <Button onClick={addSocialMedia} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Social Media
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contactData.socialMedia.map((social, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant="secondary">Social {index + 1}</Badge>
                      <Button variant="outline" size="sm" onClick={() => removeSocialMedia(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Platform Name</label>
                        <Input value={social.name} onChange={(e) => updateSocialMedia(index, "name", e.target.value)} placeholder="e.g., Facebook, Instagram" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Link</label>
                        <Input value={social.link} onChange={(e) => updateSocialMedia(index, "link", e.target.value)} placeholder="e.g., https://facebook.com/brandify" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Icon</label>
                        <select value={social.icon} onChange={(e) => updateSocialMedia(index, "icon", e.target.value)} className="w-full px-3 py-2 border rounded-md">
                          <option value="Facebook">Facebook</option>
                          <option value="Instagram">Instagram</option>
                          <option value="Twitter">Twitter</option>
                          <option value="Youtube">YouTube</option>
                          <option value="Linkedin">LinkedIn</option>
                          <option value="Tiktok">TikTok</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Color</label>
                        <select value={social.color} onChange={(e) => updateSocialMedia(index, "color", e.target.value)} className="w-full px-3 py-2 border rounded-md">
                          <option value="text-blue-600">Blue</option>
                          <option value="text-pink-600">Pink</option>
                          <option value="text-blue-400">Light Blue</option>
                          <option value="text-red-600">Red</option>
                          <option value="text-blue-700">Dark Blue</option>
                          <option value="text-black">Black</option>
                        </select>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <SeoSettingsCard
            data={{
              metaTitle: contactData.metaTitle,
              metaDescription: contactData.metaDescription,
              metaKeywords: contactData.metaKeywords,
              ogTitle: contactData.ogTitle,
              ogDescription: contactData.ogDescription,
              ogImageUrl: contactData.ogImageUrl,
              canonicalUrl: contactData.canonicalUrl,
              noindex: contactData.noindex,
            }}
            onChange={handleSeoChange}
            pageName="Contact"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
