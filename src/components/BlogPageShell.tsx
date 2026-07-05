"use client";

import { useRouter } from "next/navigation";
import Navbar from "./Navbar";
import BlogDetailView from "./BlogDetailView";
import { PortfolioData, BlogPost, PageName } from "@/types/portfolio";
import { pathForPage } from "@/lib/portfolioPages";
import { Locale } from "@/types/localized";

interface BlogPageShellProps {
  data: PortfolioData;
  post: BlogPost;
  locale: Locale;
}

export default function BlogPageShell({
  data,
  post,
  locale,
}: BlogPageShellProps) {
  const router = useRouter();

  const handleNavigate = (page: PageName) => {
    router.push(pathForPage(page, locale));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="site-canvas site-canvas--project">
      <Navbar
        profile={data.profile}
        activePage="blog"
        onNavigate={handleNavigate}
      />
      <main className="page-shell page-shell--project" id="main-content">
        <BlogDetailView
          data={data}
          post={post}
          locale={locale}
          onNavigate={handleNavigate}
        />
      </main>
    </div>
  );
}
