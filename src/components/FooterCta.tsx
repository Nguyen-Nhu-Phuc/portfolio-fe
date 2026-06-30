"use client";

import { PageName, Profile } from "@/types/portfolio";
import { useMessages } from "@/hooks/useMessages";

interface FooterCtaProps {
  profile: Profile;
  onNavigate: (page: PageName) => void;
}

export default function FooterCta({ profile, onNavigate }: FooterCtaProps) {
  const t = useMessages();

  return (
    <section className="footer-cta tile tile--dark reveal">
      <div className="tile-inner footer-cta-inner">
        <div className="footer-cta-copy">
          <p className="footer-cta-eyebrow">{t.footerCta.eyebrow}</p>
          <h2 className="footer-cta-title">{t.footerCta.title}</h2>
          <p className="footer-cta-lead">{t.footerCta.lead}</p>
          {profile.availability && (
            <p className="footer-cta-note">{profile.availability}</p>
          )}
        </div>
        <div className="footer-cta-actions">
          <button
            type="button"
            className="btn-primary btn-on-dark"
            onClick={() => onNavigate("contact")}
          >
            {t.actions.startProject}
          </button>
          <a
            href={`mailto:${profile.email}`}
            className="btn-secondary btn-on-dark"
          >
            {t.contact.sendEmail}
          </a>
          {profile.phone && (
            <a
              href={`tel:${profile.phone.replace(/\s/g, "")}`}
              className="footer-cta-phone text-link-on-dark"
            >
              {profile.phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
