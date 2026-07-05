"use client";

import { useEffect } from "react";
import ProjectDetailHero from "./ProjectDetailHero";
import ProjectMedia from "./ProjectMedia";
import NextProjectCard from "./NextProjectCard";
import Footer from "./Footer";
import { PortfolioData, Project, PageName } from "@/types/portfolio";
import { getNextProject } from "@/lib/projectSlug";
import { useMessages } from "@/hooks/useMessages";
import { Locale } from "@/types/localized";

interface ProjectDetailViewProps {
  data: PortfolioData;
  project: Project;
  locale: Locale;
  onNavigate: (page: PageName) => void;
}

export default function ProjectDetailView({
  data,
  project,
  locale,
  onNavigate,
}: ProjectDetailViewProps) {
  const t = useMessages();
  const nextProject = getNextProject(data.projects, project);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project.title]);

  return (
    <article className="project-page">
      <div className="project-page-inner">
        <ProjectDetailHero project={project} liveLabel={t.project.liveView} />

        <section className="project-content-components">
          <ProjectMedia
            src={project.image}
            alt={project.title}
            caption={project.category}
          />
        </section>

        {nextProject && (
          <section className="project-content-next grid-12">
            <NextProjectCard
              project={nextProject}
              locale={locale}
              prefix={t.project.nextProject}
            />
          </section>
        )}
      </div>

      <Footer profile={data.profile} onNavigate={onNavigate} />
    </article>
  );
}
