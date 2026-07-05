"use client";

import { useRouter } from "next/navigation";
import Navbar from "./Navbar";
import ProjectDetailView from "./ProjectDetailView";
import { PortfolioData, Project, PageName } from "@/types/portfolio";
import { pathForPage } from "@/lib/portfolioPages";
import { Locale } from "@/types/localized";

interface ProjectPageShellProps {
  data: PortfolioData;
  project: Project;
  locale: Locale;
}

export default function ProjectPageShell({
  data,
  project,
  locale,
}: ProjectPageShellProps) {
  const router = useRouter();

  const handleNavigate = (page: PageName) => {
    router.push(pathForPage(page, locale));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="site-canvas site-canvas--project">
      <Navbar
        profile={data.profile}
        activePage="portfolio"
        onNavigate={handleNavigate}
      />
      <main className="page-shell page-shell--project" id="main-content">
        <ProjectDetailView
          data={data}
          project={project}
          locale={locale}
          onNavigate={handleNavigate}
        />
      </main>
    </div>
  );
}
