import Link from "next/link";
import PortfolioImage from "./PortfolioImage";
import IonIcon from "./IonIcon";
import { BlogPost } from "@/types/portfolio";
import { pathForBlog } from "@/lib/blogSlug";
import { Locale } from "@/types/localized";

interface NextBlogCardProps {
  post: BlogPost;
  locale: Locale;
  prefix: string;
}

export default function NextBlogCard({
  post,
  locale,
  prefix,
}: NextBlogCardProps) {
  return (
    <Link href={pathForBlog(post, locale)} className="next-project" replace>
      {post.image ? (
        <PortfolioImage
          src={post.image}
          alt=""
          width={0}
          height={0}
          sizes="120px"
          className="next-project-image"
          style={{ width: "auto", height: "auto", maxHeight: "100%" }}
        />
      ) : (
        <span className="next-project-image next-project-image--placeholder" />
      )}
      <div className="next-project-content">
        <p className="next-project-prefix">{prefix}:</p>
        <h3 className="next-project-title">{post.title}</h3>
      </div>
      <IonIcon name="arrow-forward-outline" className="next-project-arrow" />
    </Link>
  );
}
