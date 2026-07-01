export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface Profile {
  name: string;
  title: string;
  tagline?: string;
  avatar: string;
  email: string;
  phone: string;
  birthday: string;
  birthdayDisplay: string;
  location: string;
  mapEmbedUrl: string;
  availability?: string;
  availabilityStatus?: "open" | "limited" | "unavailable";
  resumeUrl?: string;
  yearsExperience?: number;
  remoteFriendly?: boolean;
  socialLinks: SocialLink[];
}

export interface Service {
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  avatar: string;
  name: string;
  role?: string;
  text: string;
  date: string;
}

export interface Client {
  logo: string;
  url: string;
}

export interface TimelineItem {
  title: string;
  period: string;
  description: string;
}

export interface Skill {
  name: string;
  percentage: number;
}

export interface Project {
  title: string;
  category: string;
  categorySlug: string;
  image: string;
  url: string;
  description?: string;
  techStack?: string[];
  featured?: boolean;
}

export interface BlogPost {
  title: string;
  category: string;
  image: string;
  excerpt: string;
  date: string;
  url: string;
}

export interface PortfolioData {
  profile: Profile;
  about: string[];
  services: Service[];
  testimonials: Testimonial[];
  clients: Client[];
  education: TimelineItem[];
  experience: TimelineItem[];
  skills: Skill[];
  projects: Project[];
  blogs: BlogPost[];
}

export type PageName = "about" | "resume" | "portfolio" | "blog" | "contact";

export interface ContactFormData {
  fullname: string;
  email: string;
  message: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  _website?: string;
}

export interface ContactSubmission {
  _id: string;
  fullname: string;
  email: string;
  message: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  read: boolean;
  createdAt: string;
}
