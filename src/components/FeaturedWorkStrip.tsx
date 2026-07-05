"use client";

import Banner from "./ui/Banner";
import PreviewCard from "./ui/PreviewCard";
import { Project, PageName } from "@/types/portfolio";
import { getPreviewProjects } from "@/lib/portfolioHelpers";
import { pathForProject } from "@/lib/projectSlug";
import { useMessages } from "@/hooks/useMessages";
import { useLocale } from "@/context/LocaleProvider";

interface FeaturedWorkStripProps {
  projects: Project[];
  onNavigate: (page: PageName) => void;
}

export default function FeaturedWorkStrip({
  projects,
  onNavigate,
}: FeaturedWorkStripProps) {
  const t = useMessages();
  const { locale } = useLocale();
  const preview = getPreviewProjects(projects);

  if (preview.length === 0) return null;

  return (
    <section className="projects tile tile--parchment reveal">
      <div className="grid-12">
        <div className="projects-title">
          <Banner
            copy={t.featuredWork.title}
            size="sm"
            className="projects-title-banner"
          />
          <h2 className="projects-title-copy">{t.sections.selectedWork}</h2>
        </div>
      </div>
      <div className="grid-12">
        <div className="projects-cards reveal-stagger">
          {preview.map((project) => (
            <PreviewCard
              key={project.title}
              title={project.title}
              description={project.description}
              image={project.image}
              imageAlt={project.title}
              href={pathForProject(project, locale)}
            />
          ))}
          <PreviewCard
            title={t.actions.startProject}
            empty
            emptyLabel={t.actions.startProject}
            onClick={() => onNavigate("contact")}
          />
        </div>
      </div>
      <div className="projects-footer-cta">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => onNavigate("portfolio")}
        >
          {t.featuredWork.viewAll}
        </button>
      </div>
    </section>
  );
}
