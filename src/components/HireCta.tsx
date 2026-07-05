"use client";

import { PageName } from "@/types/portfolio";
import { useMessages } from "@/hooks/useMessages";

interface HireCtaProps {
  title?: string;
  lead?: string;
  onNavigate: (page: PageName) => void;
  email?: string;
  resumeUrl?: string;
}

export default function HireCta({
  title,
  lead,
  onNavigate,
  email,
  resumeUrl,
}: HireCtaProps) {
  const t = useMessages();

  return (
    <section className="tile tile--dark-3 reveal hire-cta">
      <div className="tile-inner hire-cta-inner">
        <div className="hire-cta-copy">
          <p className="hire-cta-eyebrow">{t.hireCta.eyebrow}</p>
          <h2 className="tile-heading tile-heading--on-dark tile-heading--center">
            {title ?? t.hireCta.title}
          </h2>
          <p className="hire-cta-lead">{lead ?? t.hireCta.lead}</p>
        </div>
        <div className="hire-cta-actions">
          <button
            type="button"
            className="btn-primary btn-on-dark"
            onClick={() => onNavigate("contact")}
          >
            {t.actions.startProject}
          </button>
          <button
            type="button"
            className="btn-secondary btn-on-dark"
            onClick={() => onNavigate("portfolio")}
          >
            {t.actions.viewCaseStudies}
          </button>
          {email && (
            <a href={`mailto:${email}`} className="text-link-on-dark hire-cta-email">
              {email}
            </a>
          )}
          {resumeUrl && (
            <a
              href={resumeUrl}
              className="text-link-on-dark"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.hero.downloadResume}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
