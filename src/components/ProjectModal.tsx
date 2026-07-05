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

function TechStack({ items, label }: { items: string[]; label: string }) {
  if (items.length === 0) return null;

  return (
    <div className="project-modal-tech">
      <p className="project-modal-tech-label">{label}</p>
      <ul className="project-modal-tech-list">
        {items.map((tech) => (
          <li className="project-modal-tech-item" key={tech}>
            {tech}
          </li>
        ))}
      </ul>
    </div>
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
        className="project-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        ref={dialogRef}
      >
        <figure className="project-modal-hero">
          <PortfolioImage
            src={project.image}
            alt=""
            className="project-modal-hero-img"
            width={0}
            height={0}
            sizes="(max-width: 960px) 100vw, 920px"
            priority
            style={{ width: "100%", height: "auto" }}
          />
          <div className="project-modal-hero-shade" aria-hidden="true" />
          <button
            type="button"
            className="project-modal-close"
            onClick={onClose}
            aria-label={t.actions.close}
          >
            <IonIcon name="close-outline" />
          </button>
        </figure>

        <div className="project-modal-panel">
          <header className="project-modal-header">
            <span className="project-modal-badge">{project.category}</span>
            <h2 className="project-modal-title" id="project-modal-title">
              {project.title}
            </h2>
          </header>

          {project.description && (
            <p className="project-modal-desc">{project.description}</p>
          )}

          <TechStack
            items={project.techStack ?? []}
            label={t.projectModal.techStack}
          />

          <footer className="project-modal-actions">
            <button
              type="button"
              className="btn-secondary project-modal-action"
              onClick={onClose}
            >
              {t.actions.close}
            </button>
            {project.url && (
              <a
                href={project.url}
                className="btn-primary project-modal-action"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.actions.viewLiveProject}
                <IonIcon name="open-outline" />
              </a>
            )}
          </footer>
        </div>
      </section>
    </div>,
    document.body
  );
}
