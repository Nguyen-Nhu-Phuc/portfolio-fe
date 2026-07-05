"use client";

import { type CSSProperties } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PageName, Profile } from "@/types/portfolio";
import { useMessages } from "@/hooks/useMessages";
import { useLocale } from "@/context/LocaleProvider";
import { localeFromPath } from "@/lib/locale";
import { pathForPage } from "@/lib/portfolioPages";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import ButtonRound from "./ui/ButtonRound";
import ArrowRightLong from "./icons/ArrowRightLong";

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
  const pathname = usePathname();
  const router = useRouter();
  const { locale } = useLocale();
  const routeLocale = localeFromPath(pathname) || locale;
  const isProjectPage = /\/project\//.test(pathname);

  const NAV_ITEMS: { label: string; page: PageName }[] = [
    { label: t.nav.about, page: "about" },
    { label: t.nav.resume, page: "resume" },
    { label: t.nav.portfolio, page: "portfolio" },
    { label: t.nav.blog, page: "blog" },
    { label: t.nav.contact, page: "contact" },
  ];

  const activeIndex = NAV_ITEMS.findIndex((item) => item.page === activePage);

  const handleBack = () => {
    router.push(pathForPage("portfolio", routeLocale));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="site-header">
      <div className="header-bar">
        {isProjectPage ? (
          <ButtonRound
            variant="accent"
            className="header-back"
            onClick={handleBack}
            aria-label={t.project.backToPortfolio}
          >
            <ArrowRightLong className="header-back-icon" />
          </ButtonRound>
        ) : (
          <button
            type="button"
            className="header-brand"
            onClick={() => onNavigate("about")}
          >
            {profile.name}
          </button>
        )}

        {!isProjectPage && (
          <nav
            className="header-pill-nav"
            aria-label="Sections"
            style={
              {
                "--nav-active-index": Math.max(activeIndex, 0),
              } as CSSProperties
            }
          >
            <span className="header-pill-bar" aria-hidden="true" />
            <ul className="header-pill-list">
              {NAV_ITEMS.map(({ label, page }) => (
                <li key={page}>
                  <button
                    type="button"
                    className={`header-pill-link${activePage === page ? " active" : ""}`}
                    aria-current={activePage === page ? "page" : undefined}
                    onClick={() => onNavigate(page)}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="header-actions">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            type="button"
            className="btn-primary header-cta"
            onClick={() => onNavigate("contact")}
          >
            {t.nav.getInTouch}
          </button>
        </div>
      </div>

      {!isProjectPage && (
        <nav className="sub-nav-mobile" aria-label="Sections">
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
        </nav>
      )}
    </header>
  );
}
