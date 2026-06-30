"use client";

import { PageName, Profile } from "@/types/portfolio";
import { useMessages } from "@/hooks/useMessages";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";

interface NavbarProps {
  profile: Profile;
  activePage: PageName;
  onNavigate: (page: PageName) => void;
}

export default function Navbar({
  profile,
  activePage,
  onNavigate,
}: NavbarProps) {
  const t = useMessages();

  const NAV_ITEMS: { label: string; page: PageName }[] = [
    { label: t.nav.about, page: "about" },
    { label: t.nav.resume, page: "resume" },
    { label: t.nav.portfolio, page: "portfolio" },
    { label: t.nav.blog, page: "blog" },
    { label: t.nav.contact, page: "contact" },
  ];

  const activeLabel =
    NAV_ITEMS.find((item) => item.page === activePage)?.label ?? t.nav.about;

  return (
    <header className="site-header">
      <nav className="global-nav" aria-label="Site">
        <div className="chrome-inner">
          <button
            type="button"
            className="global-nav-brand"
            onClick={() => onNavigate("about")}
          >
            {profile.name}
          </button>
          <div className="global-nav-actions">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              type="button"
              className="global-nav-link global-nav-link--hide-mobile"
              onClick={() => onNavigate("portfolio")}
            >
              {t.nav.work}
            </button>
            <a
              href={`mailto:${profile.email}`}
              className="global-nav-link global-nav-link--hide-mobile"
            >
              {t.nav.email}
            </a>
          </div>
        </div>
      </nav>

      <nav className="sub-nav-frosted" aria-label="Sections">
        <div className="chrome-inner sub-nav-inner">
          <span className="sub-nav-title" key={activePage}>
            {activeLabel}
          </span>
          <ul className="sub-nav-list">
            {NAV_ITEMS.map(({ label, page }) => (
              <li className="sub-nav-item" key={page}>
                <button
                  type="button"
                  className={`sub-nav-link${activePage === page ? " active" : ""}`}
                  aria-current={activePage === page ? "page" : undefined}
                  onClick={() => onNavigate(page)}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="btn-primary sub-nav-cta"
            onClick={() => onNavigate("contact")}
          >
            {t.nav.getInTouch}
          </button>
        </div>
      </nav>
    </header>
  );
}
