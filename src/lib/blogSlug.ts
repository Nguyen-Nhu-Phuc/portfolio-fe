import { BlogPost } from "@/types/portfolio";
import { Locale } from "@/types/localized";
import { projectSlug } from "./projectSlug";

export function blogSlug(title: string): string {
  return projectSlug(title);
}

export function pathForBlog(post: BlogPost, locale: Locale = "en"): string {
  return `/${locale}/blog/${blogSlug(post.title)}`;
}

export function findBlogBySlug(
  blogs: BlogPost[],
  slug: string
): BlogPost | undefined {
  return blogs.find((post) => blogSlug(post.title) === slug);
}

export function getNextBlogPost(
  blogs: BlogPost[],
  current: BlogPost
): BlogPost | null {
  const index = blogs.findIndex((post) => post.title === current.title);
  if (index === -1 || blogs.length === 0) return null;
  return blogs[(index + 1) % blogs.length];
}

export function isExternalBlogUrl(url: string): boolean {
  if (!url?.trim() || url === "#") return false;
  return /^https?:\/\//i.test(url);
}
