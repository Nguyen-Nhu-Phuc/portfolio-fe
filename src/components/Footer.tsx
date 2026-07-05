"use client";

import { PageName, Profile } from "@/types/portfolio";
import { useMessages } from "@/hooks/useMessages";
import ArrowRightLong from "./icons/ArrowRightLong";
import ButtonRound from "./ui/ButtonRound";

interface FooterProps {
  profile: Profile;
  onNavigate: (page: PageName) => void;
}

export default function Footer({ profile, onNavigate }: FooterProps) {
  const t = useMessages();
  const year = new Date().getFullYear();

  const FOOTER_SECTIONS: { title: string; links: { label: string; page: PageName }[] }[] =
    [
      {
        title: t.footer.explore,
        links: [
          { label: t.nav.about, page: "about" },
          { label: t.nav.resume, page: "resume" },
          { label: t.nav.portfolio, page: "portfolio" },
        ],
      },
      {
        title: t.footer.more,
        links: [
          { label: t.nav.blog, page: "blog" },
          { label: t.nav.contact, page: "contact" },
        ],
      },
    ];

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <button
          type="button"
          className="footer-back-to-top"
          onClick={handleBackToTop}
          aria-label="Back to top"
        >
          <ButtonRound variant="border" as="div">
            <ArrowRightLong className="footer-back-to-top-icon" />
          </ButtonRound>
        </button>

        <div className="site-footer-brand reveal">
          <p className="site-footer-name">{profile.name}</p>
          <p className="site-footer-tagline">{profile.title}</p>
          <a href={`mailto:${profile.email}`} className="text-link">
            {profile.email}
          </a>
          <button
            type="button"
            className="btn-primary site-footer-contact-btn"
            onClick={() => onNavigate("contact")}
          >
            {t.nav.getInTouch}
          </button>
        </div>

        {FOOTER_SECTIONS.map((section) => (
          <div className="site-footer-col reveal" key={section.title}>
            <p className="site-footer-col-title">{section.title}</p>
            <ul className="site-footer-links">
              {section.links.map((link) => (
                <li key={link.page}>
                  <button
                    type="button"
                    className="site-footer-link"
                    onClick={() => onNavigate(link.page)}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="site-footer-col reveal">
          <p className="site-footer-col-title">{t.footer.connect}</p>
          <ul className="site-footer-links">
            {profile.socialLinks.map((link) => (
              <li key={link.platform}>
                <a
                  href={link.url}
                  className="site-footer-link text-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="site-footer-legal reveal">
        <p>
          © {year} {profile.name}. {t.footer.crafted}
        </p>
        <p>{profile.location}</p>
      </div>
    </footer>
  );
}
