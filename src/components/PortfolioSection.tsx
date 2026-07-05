"use client";

import { useEffect, useRef, useState } from "react";
import IonIcon from "./IonIcon";
import Banner from "./ui/Banner";
import PreviewCard from "./ui/PreviewCard";
import PageHero from "./PageHero";
import HireCta from "./HireCta";
import { Project, PageName, ProjectCategory } from "@/types/portfolio";
import { getFeaturedProject } from "@/lib/portfolioHelpers";
import { pathForProject } from "@/lib/projectSlug";
import { useMessages } from "@/hooks/useMessages";
import { useLocale } from "@/context/LocaleProvider";
import {
  buildProjectFilters,
  resolveProjectCategories,
} from "@/lib/projectCategories";

interface PortfolioSectionProps {
  projects: Project[];
  projectCategories?: ProjectCategory[];
  isActive?: boolean;
  onNavigate: (page: PageName) => void;
}

export default function PortfolioSection({
  projects,
  projectCategories,
  isActive = false,
  onNavigate,
}: PortfolioSectionProps) {
  const t = useMessages();
  const { locale } = useLocale();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectOpen, setSelectOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const filters = buildProjectFilters(
    resolveProjectCategories(projectCategories),
    t.filters.all
  );

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
          lead={featured.description ?? featured.category}
          image={{ src: featured.image, alt: featured.title }}
          actions={[
            {
              label: t.actions.viewDetails,
              href: pathForProject(featured, locale),
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
        <section className="projects tile tile--parchment reveal">
          <div className="grid-12">
            <div className="projects-title">
              <Banner copy={t.nav.portfolio} size="sm" className="projects-title-banner" />
              <h2 className="projects-title-copy">{t.sections.selectedWork}</h2>
              <p className="projects-subheading">{t.portfolio.subheading}</p>
            </div>
          </div>

          <div className="grid-12">
            <ul className="filter-list reveal projects-filters">
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
              <div className="projects-cards reveal-stagger">
                {filteredProjects.map((project) => (
                  <PreviewCard
                    key={project.title}
                    title={project.title}
                    description={
                      project.description
                        ? `${project.category} · ${project.description}`
                        : project.category
                    }
                    image={project.image}
                    imageAlt={project.title}
                    href={pathForProject(project, locale)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <HireCta onNavigate={onNavigate} />
      </div>
    </article>
  );
}
