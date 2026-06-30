"use client";

import PortfolioImage from "./PortfolioImage";
import PageHero from "./PageHero";
import { BlogPost } from "@/types/portfolio";
import { useMessages } from "@/hooks/useMessages";
import { useLocale } from "@/context/LocaleProvider";

interface BlogProps {
  blogs: BlogPost[];
  isActive?: boolean;
}

function formatBlogDate(dateStr: string, locale: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Blog({ blogs, isActive = false }: BlogProps) {
  const t = useMessages();
  const { locale } = useLocale();
  const featured = blogs[0];

  return (
    <article className={`blog${isActive ? " active" : ""}`} data-page="blog">
      <PageHero
        variant="parchment"
        eyebrow={t.blog.journal}
        title={t.sections.latestWriting}
        lead={
          featured
            ? t.blog.lead.replace("{category}", featured.category.toLowerCase())
            : t.blog.lead.replace("{category}", "design")
        }
        stats={[{ value: String(blogs.length), label: t.stats.articles }]}
      />

      <div className="tile-stack">
        <section className="tile tile--light reveal">
          <div className="tile-inner">
            <ul className="utility-grid utility-grid--blog reveal-stagger">
              {blogs.map((post) => (
                <li className="utility-card utility-card--blog reveal" key={post.title}>
                  <a href={post.url} className="utility-card-link">
                    <figure className="utility-card-media">
                      <PortfolioImage
                        src={post.image}
                        alt={post.title}
                        width={400}
                        height={240}
                        sizes="(max-width: 768px) 100vw, 400px"
                        loading="lazy"
                      />
                    </figure>
                    <div className="utility-card-body">
                      <div className="blog-meta">
                        <span className="blog-category">{post.category}</span>
                        <span className="dot"></span>
                        <time dateTime={post.date}>
                          {formatBlogDate(post.date, locale)}
                        </time>
                      </div>
                      <h3 className="utility-card-title">{post.title}</h3>
                      <p className="utility-card-text">{post.excerpt}</p>
                      <span className="text-link">{t.actions.readArticle}</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </article>
  );
}
