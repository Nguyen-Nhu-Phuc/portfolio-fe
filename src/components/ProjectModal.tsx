"use client";

import { createPortal } from "react-dom";
import { useSyncExternalStore } from "react";
import PortfolioImage from "./PortfolioImage";
import IonIcon from "./IonIcon";
import { Project } from "@/types/portfolio";
import { useMessages } from "@/hooks/useMessages";
import { useModalA11y } from "@/hooks/useModalA11y";

interface ProjectModalProps {
  project: Project | null;
  open: boolean;
  onClose: () => void;
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

const subscribe = () => () => {};

export default function ProjectModal({ project, open, onClose }: ProjectModalProps) {
  const t = useMessages();
  const dialogRef = useModalA11y(open, onClose);
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  if (!mounted || !project || !open) return null;

  return createPortal(
    <div className="modal-container active">
      <div
        className="overlay active"
        onClick={onClose}
        aria-hidden="true"
      />
      <section
        className="testimonials-modal portfolio-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        ref={dialogRef}
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          <IonIcon name="close-outline" />
        </button>

        <figure className="portfolio-modal-img">
          <PortfolioImage
            src={project.image}
            alt={project.title}
            width={800}
            height={450}
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </figure>

        <div className="portfolio-modal-body">
          <p className="portfolio-modal-category">{project.category}</p>
          <h3 className="h3 modal-title" id="project-modal-title">
            {project.title}
          </h3>
          {project.description && (
            <p className="portfolio-modal-desc">{project.description}</p>
          )}
          <TechStack items={project.techStack ?? []} />
          {project.url && (
            <a
              href={project.url}
              className="btn-primary portfolio-modal-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.actions.viewLiveProject}
            </a>
          )}
        </div>
      </section>
    </div>,
    document.body
  );
}
