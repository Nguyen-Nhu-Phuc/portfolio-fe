"use client";

import { useState } from "react";
import PortfolioImage from "./PortfolioImage";
import ProjectModal from "./ProjectModal";
import { Project, PageName } from "@/types/portfolio";
import { getPreviewProjects } from "@/lib/portfolioHelpers";
import { useMessages } from "@/hooks/useMessages";

interface FeaturedWorkStripProps {
  projects: Project[];
  onNavigate: (page: PageName) => void;
}

function formatCategory(category: string) {
  return category.replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function FeaturedWorkStrip({
  projects,
  onNavigate,
}: FeaturedWorkStripProps) {
  const t = useMessages();
  const preview = getPreviewProjects(projects);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);

  if (preview.length === 0) return null;

  const openProject = (project: Project) => {
    setSelected(project);
    setModalOpen(true);
  };

  return (
    <>
      <section className="tile tile--parchment reveal">
        <div className="tile-inner">
          <div className="section-header">
            <div>
              <h2 className="tile-heading">{t.featuredWork.title}</h2>
              <p className="tile-subheading">{t.featuredWork.subheading}</p>
            </div>
            <button
              type="button"
              className="btn-secondary section-header-action"
              onClick={() => onNavigate("portfolio")}
            >
              {t.featuredWork.viewAll}
            </button>
          </div>

          <ul className="featured-work-grid reveal-stagger">
            {preview.map((project) => (
              <li className="featured-work-card reveal" key={project.title}>
                <button
                  type="button"
                  className="featured-work-link"
                  onClick={() => openProject(project)}
                >
                  <figure className="featured-work-media">
                    <PortfolioImage
                      src={project.image}
                      alt={project.title}
                      width={480}
                      height={300}
                      sizes="(max-width: 768px) 100vw, 320px"
                      loading="lazy"
                    />
                  </figure>
                  <div className="featured-work-body">
                    <p className="featured-work-meta">
                      {formatCategory(project.category)}
                    </p>
                    <h3 className="featured-work-title">{project.title}</h3>
                    {project.description && (
                      <p className="featured-work-text">{project.description}</p>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>

          <div className="featured-work-cta">
            <p className="featured-work-cta-text">{t.featuredWork.ctaText}</p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => onNavigate("contact")}
            >
              {t.actions.startProject}
            </button>
          </div>
        </div>
      </section>

      <ProjectModal
        project={selected}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
