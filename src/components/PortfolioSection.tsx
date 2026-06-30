"use client";

import { useEffect, useRef, useState } from "react";
import IonIcon from "./IonIcon";
import PortfolioImage from "./PortfolioImage";
import PageHero from "./PageHero";
import HireCta from "./HireCta";
import ProjectModal from "./ProjectModal";
import { Project, PageName } from "@/types/portfolio";
import { getFeaturedProject } from "@/lib/portfolioHelpers";
import { useMessages } from "@/hooks/useMessages";
import { FILTER_SLUGS } from "@/i18n/messages";

interface PortfolioSectionProps {
  projects: Project[];
  isActive?: boolean;
  onNavigate: (page: PageName) => void;
}

function formatCategory(category: string) {
  return category.replace(/\b\w/g, (char) => char.toUpperCase());
}

function TechStack({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="tech-stack">
      {items.map((tech) => (
        <li className="tech-stack-item" key={tech}>
          {tech}
        </li>
      ))}
    </ul>
  );
}

export default function PortfolioSection({
  projects,
  isActive = false,
  onNavigate,
}: PortfolioSectionProps) {
  const t = useMessages();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectOpen, setSelectOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const filters = FILTER_SLUGS.map(({ slug, key }) => ({
    slug,
    label: t.filters[key],
  }));

  const featured = getFeaturedProject(projects);
  const displayValue =
    filters.find((f) => f.slug === selectedFilter)?.label ?? t.filters.all;

  const filteredProjects = projects.filter(
    (project) =>
      selectedFilter === "all" || project.categorySlug === selectedFilter
  );

  const handleFilter = (value: string) => {
    setSelectedFilter(value);
    setSelectOpen(false);
  };

  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const closeProjectModal = () => setModalOpen(false);

  useEffect(() => {
    if (!selectOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setSelectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectOpen]);

  return (
    <article
      className={`portfolio${isActive ? " active" : ""}`}
      data-page="portfolio"
    >
      {featured && (
        <PageHero
          variant="dark"
          eyebrow={t.sections.featuredCaseStudy}
          title={featured.title}
          lead={featured.description ?? formatCategory(featured.category)}
          image={{ src: featured.image, alt: featured.title }}
          actions={[
            {
              label: t.actions.viewDetails,
              onClick: () => openProjectModal(featured),
            },
            {
              label: t.actions.liveSite,
              variant: "secondary",
              href: featured.url,
            },
          ]}
        />
      )}

      <div className="tile-stack">
        <section className="tile tile--light reveal">
          <div className="tile-inner">
            <h2 className="tile-heading">{t.sections.selectedWork}</h2>
            <p className="tile-subheading">{t.portfolio.subheading}</p>

            <ul className="filter-list reveal">
              {filters.map(({ slug, label }) => (
                <li className="filter-item" key={slug}>
                  <button
                    type="button"
                    className={selectedFilter === slug ? "active" : ""}
                    onClick={() => handleFilter(slug)}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="filter-select-box" ref={filterRef}>
              <button
                type="button"
                className={`filter-select${selectOpen ? " active" : ""}`}
                aria-expanded={selectOpen}
                aria-haspopup="listbox"
                onClick={() => setSelectOpen((prev) => !prev)}
              >
                <div className="select-value">{displayValue}</div>
                <div className="select-icon">
                  <IonIcon name="chevron-down" />
                </div>
              </button>
              <ul className="select-list" role="listbox">
                {filters.map(({ slug, label }) => (
                  <li className="select-item" key={slug}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selectedFilter === slug}
                      onClick={() => handleFilter(slug)}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {filteredProjects.length === 0 ? (
              <p className="project-empty">{t.portfolio.empty}</p>
            ) : (
              <ul className="utility-grid utility-grid--portfolio reveal-stagger">
                {filteredProjects.map((project) => (
                  <li
                    className="utility-card utility-card--project reveal"
                    key={project.title}
                  >
                    <button
                      type="button"
                      className="utility-card-btn"
                      onClick={() => openProjectModal(project)}
                      aria-label={`${t.actions.viewProject}: ${project.title}`}
                    >
                      <figure className="utility-card-media">
                        <PortfolioImage
                          src={project.image}
                          alt={project.title}
                          width={400}
                          height={280}
                          sizes="(max-width: 768px) 100vw, 400px"
                          loading="lazy"
                        />
                      </figure>
                      <div className="utility-card-body">
                        <p className="utility-card-meta">
                          {formatCategory(project.category)}
                        </p>
                        <h3 className="utility-card-title">{project.title}</h3>
                        {project.description && (
                          <p className="utility-card-text utility-card-text--clamp">
                            {project.description}
                          </p>
                        )}
                        <TechStack items={project.techStack ?? []} />
                        <span className="text-link">{t.actions.viewCaseStudy}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <HireCta onNavigate={onNavigate} />
      </div>

      <ProjectModal
        project={selectedProject}
        open={modalOpen}
        onClose={closeProjectModal}
      />
    </article>
  );
}
