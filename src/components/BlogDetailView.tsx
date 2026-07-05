"use client";

import { useEffect } from "react";
import BlogDetailHero from "./BlogDetailHero";
import ProjectMedia from "./ProjectMedia";
import NextBlogCard from "./NextBlogCard";
import Footer from "./Footer";
import { PortfolioData, BlogPost, PageName } from "@/types/portfolio";
import { getNextBlogPost } from "@/lib/blogSlug";
import { useMessages } from "@/hooks/useMessages";
import { Locale } from "@/types/localized";

interface BlogDetailViewProps {
  data: PortfolioData;
  post: BlogPost;
  locale: Locale;
  onNavigate: (page: PageName) => void;
}

function formatBlogDate(dateStr: string, locale: Locale) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogDetailView({
  data,
  post,
  locale,
  onNavigate,
}: BlogDetailViewProps) {
  const t = useMessages();
  const nextPost = getNextBlogPost(data.blogs, post);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [post.title]);

  return (
    <article className="project-page blog-detail-page">
      <div className="project-page-inner">
        <BlogDetailHero
          post={post}
          formattedDate={formatBlogDate(post.date, locale)}
          readLabel={t.actions.readArticle}
        />

        {post.image && (
          <section className="project-content-components">
            <ProjectMedia
              src={post.image}
              alt={post.title}
              caption={post.category}
            />
          </section>
        )}

        {nextPost && (
          <section className="project-content-next grid-12">
            <NextBlogCard
              post={nextPost}
              locale={locale}
              prefix={t.blog.nextPost}
            />
          </section>
        )}
      </div>

      <Footer profile={data.profile} onNavigate={onNavigate} />
    </article>
  );
}
