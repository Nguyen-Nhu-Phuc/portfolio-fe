import ProjectTag from "./ui/ProjectTag";
import { BlogPost } from "@/types/portfolio";

interface BlogDetailHeroProps {
  post: BlogPost;
  formattedDate: string;
  readLabel: string;
}

export default function BlogDetailHero({
  post,
  formattedDate,
  readLabel,
}: BlogDetailHeroProps) {
  return (
    <section className="project-hero grid-12">
      <div className="project-hero-top">
        <div className="project-hero-title-wrapper">
          <p className="blog-detail-eyebrow">{formattedDate}</p>
          <h1 className="project-hero-title">{post.title}</h1>
        </div>
        <div className="project-hero-tags">
          <ProjectTag label={post.category} />
        </div>
      </div>

      {post.excerpt && (
        <p className="project-hero-description">{post.excerpt}</p>
      )}

      {/^https?:\/\//i.test(post.url) && (
        <div className="project-hero-buttons">
          <a
            href={post.url}
            className="btn-primary project-hero-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            {readLabel}
          </a>
        </div>
      )}
    </section>
  );
}
