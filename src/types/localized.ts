export type Locale = "en" | "vi";

export interface LocalizedString {
  en: string;
  vi: string;
}

export interface LocalizedAbout {
  en: string[];
  vi: string[];
}

export interface AdminSocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface AdminProfile {
  name: LocalizedString;
  title: LocalizedString;
  tagline?: LocalizedString;
  avatar: string;
  email: string;
  phone: string;
  birthday: string;
  birthdayDisplay: LocalizedString;
  location: LocalizedString;
  mapEmbedUrl: string;
  availability?: LocalizedString;
  availabilityStatus?: "open" | "limited" | "unavailable";
  resumeUrl?: string;
  yearsExperience?: number;
  remoteFriendly?: boolean;
  socialLinks: AdminSocialLink[];
}

export interface AdminService {
  icon: string;
  title: LocalizedString;
  description: LocalizedString;
}

export interface AdminTestimonial {
  avatar: string;
  name: LocalizedString;
  role?: LocalizedString;
  text: LocalizedString;
  date: string;
}

export interface AdminTimelineItem {
  title: LocalizedString;
  period: LocalizedString;
  description: LocalizedString;
}

export interface AdminSkill {
  name: LocalizedString;
  percentage: number;
}

export interface AdminProject {
  title: LocalizedString;
  category: LocalizedString;
  categorySlug: string;
  image: string;
  url: string;
  description?: LocalizedString;
  techStack?: string[];
  featured?: boolean;
}

export interface AdminBlogPost {
  title: LocalizedString;
  category: LocalizedString;
  image: string;
  excerpt: LocalizedString;
  date: string;
  url: string;
}

export interface AdminClient {
  logo: string;
  url: string;
}

export interface PortfolioAdminData {
  profile: AdminProfile;
  about: LocalizedAbout;
  services: AdminService[];
  testimonials: AdminTestimonial[];
  clients: AdminClient[];
  education: AdminTimelineItem[];
  experience: AdminTimelineItem[];
  skills: AdminSkill[];
  projects: AdminProject[];
  blogs: AdminBlogPost[];
}

export function emptyLoc(): LocalizedString {
  return { en: "", vi: "" };
}
