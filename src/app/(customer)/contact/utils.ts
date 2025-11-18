import { ContactPageData } from "./types";

/**
 * Fetch contact page data from API
 */
export async function fetchContactData(): Promise<ContactPageData> {
  try {
    const response = await fetch("/api/contact-page");
    if (response.ok) {
      const data = await response.json();
      return data || getDefaultContactData();
    }
    return getDefaultContactData();
  } catch (error) {
    console.error("Error loading contact data:", error);
    return getDefaultContactData();
  }
}

/**
 * Get default contact data as fallback
 */
export function getDefaultContactData(): ContactPageData {
  return {
    id: 0,
    heroTitle: "We Are Ready to Help You",
    heroSubtitle: "Contact Us",
    heroDescription: "Have a question or need assistance? Our customer service team is ready to help you with the best service and quick response.",
    contactMethods: [
      {
        icon: "Phone",
        title: "Phone",
        subtitle: "Monday - Friday, 08:00 - 17:00",
        value: "+62 21 1234 5678",
        link: "tel:+622112345678",
        bgColor: "bg-blue-500",
      },
      {
        icon: "MessageSquare",
        title: "WhatsApp",
        subtitle: "24/7 Fast Response",
        value: "+62 812 3456 7890",
        link: "https://wa.me/6281234567890",
        bgColor: "bg-green-500",
      },
      {
        icon: "Mail",
        title: "Email",
        subtitle: "Response within 24 hours",
        value: "support@brandify.com",
        link: "mailto:support@brandify.com",
        bgColor: "bg-purple-500",
      },
      {
        icon: "Headphones",
        title: "Live Chat",
        subtitle: "Monday - Saturday, 08:00 - 22:00",
        value: "Live Chat",
        link: "#",
        bgColor: "bg-orange-500",
      },
    ],
    officeLocations: [
      {
        city: "Jakarta",
        address: "Jl. Sudirman No. 123, Jakarta Pusat",
        phone: "+62 21 1234 5678",
        isMain: true,
      },
      {
        city: "Surabaya",
        address: "Jl. Ahmad Yani No. 456, Surabaya",
        phone: "+62 31 8765 4321",
        isMain: false,
      },
      {
        city: "Bandung",
        address: "Jl. Asia Afrika No. 789, Bandung",
        phone: "+62 22 9876 5432",
        isMain: false,
      },
    ],
    businessHours: [
      { day: "Monday - Friday", hours: "08:00 - 17:00", closed: false },
      { day: "Saturday", hours: "09:00 - 15:00", closed: false },
      { day: "Sunday", hours: "", closed: true },
    ],
    socialMedia: [
      { name: "Facebook", link: "#", icon: "Facebook", color: "text-blue-600" },
      { name: "Instagram", link: "#", icon: "Instagram", color: "text-pink-600" },
      { name: "Twitter", link: "#", icon: "Twitter", color: "text-blue-400" },
      { name: "YouTube", link: "#", icon: "Youtube", color: "text-red-600" },
    ],
  };
}

/**
 * Submit contact form
 * @param formData - Contact form data (currently unused in simulation)
 */
export async function submitContactForm(formData: { name: string; email: string; subject: string; message: string }): Promise<boolean> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // In production, replace with actual API call:
  // const response = await fetch("/api/contact", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(formData),
  // });
  // return response.ok;

  // Suppress unused warning for simulation
  void formData;
  return true;
}
