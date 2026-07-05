"use client";

import Link from "next/link";
import PortfolioImage from "./PortfolioImage";
import PageHero from "./PageHero";
import { BlogPost } from "@/types/portfolio";
import { pathForBlog } from "@/lib/blogSlug";
import { useMessages } from "@/hooks/useMessages";
import { useLocale } from "@/context/LocaleProvider";
import { Locale } from "@/types/localized";

interface BlogProps {
  blogs: BlogPost[];
  isActive?: boolean;
}

function formatBlogDate(dateStr: string, locale: Locale) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function BlogPostCard({
  post,
  locale,
  readLabel,
  featured = false,
}: {
  post: BlogPost;
  locale: Locale;
  readLabel: string;
  featured?: boolean;
}) {
  return (
    <div className={`blog-post-card${featured ? " blog-post-card--featured" : ""}`}>
      <Link href={pathForBlog(post, locale)} className="blog-post-card-link">
        {post.image ? (
          <figure className="blog-post-card-media">
            <PortfolioImage
              src={post.image}
              alt={post.title}
              width={0}
              height={0}
              sizes={
                featured
                  ? "(max-width: 768px) 100vw, 640px"
                  : "(max-width: 768px) 100vw, 400px"
              }
              loading={featured ? "eager" : "lazy"}
              style={{ width: "100%", height: "auto" }}
            />
          </figure>
        ) : null}
        <div className="blog-post-card-body">
          <div className="blog-meta">
            <span className="blog-category">{post.category}</span>
            <span className="dot" aria-hidden="true" />
            <time dateTime={post.date}>{formatBlogDate(post.date, locale)}</time>
          </div>
          <h3 className="blog-post-card-title">{post.title}</h3>
          <p className="blog-post-card-excerpt">{post.excerpt}</p>
          <span className="text-link blog-post-card-cta">{readLabel}</span>
        </div>
      </Link>
    </div>
  );
}

export default function Blog({ blogs, isActive = false }: BlogProps) {
  const t = useMessages();
  const { locale } = useLocale();
  const featured = blogs[0];
  const rest = blogs.slice(1);
  const categories = [...new Set(blogs.map((post) => post.category))];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const lead = featured
    ? t.blog.lead.replace("{category}", featured.category.toLowerCase())
    : t.blog.lead.replace("{category}", "design");

  return (
    <article className={`blog${isActive ? " active" : ""}`} data-page="blog">
      <PageHero
        variant="parchment"
        compact
        statsAside
        eyebrow={t.blog.journal}
        title={t.sections.latestWriting}
        lead={lead}
        stats={
          blogs.length > 0
            ? [
                { value: String(blogs.length), label: t.stats.articles },
                { value: String(categories.length), label: t.blog.topics },
                {
                  value: formatDate(featured.date),
                  label: t.blog.latestPost,
                },
              ]
            : [{ value: "0", label: t.stats.articles }]
        }
      />

      <div className="tile-stack">
        <section className="tile tile--light">
          <div className="tile-inner tile-inner--wide">
            {blogs.length === 0 ? (
              <p className="blog-empty">{t.blog.empty}</p>
            ) : (
              <>
                {categories.length > 0 && (
                  <ul className="skill-tags blog-category-tags">
                    {categories.map((category) => (
                      <li className="skill-tag" key={category}>
                        {category}
                      </li>
                    ))}
                  </ul>
                )}

                <BlogPostCard
                  post={featured}
                  locale={locale}
                  readLabel={t.blog.readLatest}
                  featured
                />

                {rest.length > 0 && (
                  <>
                    <h2 className="tile-heading blog-posts-heading">
                      {t.blog.allPosts}
                    </h2>
                    <ul className="blog-posts-grid">
                      {rest.map((post) => (
                        <li key={post.title}>
                          <BlogPostCard
                            post={post}
                            locale={locale}
                            readLabel={t.actions.readArticle}
                          />
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </article>
  );
}
