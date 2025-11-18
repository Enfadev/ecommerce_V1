"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { ContactFormData } from "../types";
import { submitContactForm } from "../utils";

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const success = await submitContactForm(formData);

    if (success) {
      toast.success("Your message has been sent! We will respond within 24 hours.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } else {
      toast.error("Failed to send message. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <Card className="p-8">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-2xl flex items-center gap-3">
          <Send className="w-6 h-6 text-primary" />
          Send Message
        </CardTitle>
        <p className="text-muted-foreground">Fill out the form below and we will respond within 24 hours</p>
      </CardHeader>
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name *
              </label>
              <Input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} placeholder="Enter your full name" required className="h-12" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email *
              </label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="example@email.com" required className="h-12" />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-2">
              Subject *
            </label>
            <Input id="subject" name="subject" type="text" value={formData.subject} onChange={handleInputChange} placeholder="Your message subject" required className="h-12" />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message *
            </label>
            <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} placeholder="Write your message or question..." rows={6} required className="resize-none" />
          </div>

          <Button type="submit" className="w-full h-12 gap-2" disabled={isSubmitting}>
            {isSubmitting ? (
              "Sending..."
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
