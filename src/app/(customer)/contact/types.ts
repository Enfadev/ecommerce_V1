export interface ContactMethod {
  icon: string;
  title: string;
  subtitle: string;
  value: string;
  link: string;
  bgColor: string;
}

export interface OfficeLocation {
  city: string;
  address: string;
  phone: string;
  isMain: boolean;
}

export interface BusinessHour {
  day: string;
  hours: string;
  closed: boolean;
}

export interface SocialMedia {
  name: string;
  link: string;
  icon: string;
  color: string;
}

export interface ContactPageData {
  id: number;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  contactMethods: ContactMethod[];
  officeLocations: OfficeLocation[];
  businessHours: BusinessHour[];
  socialMedia: SocialMedia[];
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
