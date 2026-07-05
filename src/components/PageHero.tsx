import Link from "next/link";
import PortfolioImage from "./PortfolioImage";
import Banner from "./ui/Banner";

export interface HeroAction {
  label: string;
  variant?: "primary" | "secondary";
  href?: string;
  onClick?: () => void;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroMeta {
  availability?: string;
  availabilityStatus?: "open" | "limited" | "unavailable";
  remoteFriendly?: boolean;
  location?: string;
}

interface PageHeroProps {
  variant?: "light" | "parchment" | "dark";
  eyebrow?: string;
  title: string;
  lead?: string;
  actions?: HeroAction[];
  image?: { src: string; alt: string; priority?: boolean };
  stats?: HeroStat[];
  meta?: HeroMeta;
  /** Shorter hero without full-viewport height */
  compact?: boolean;
  /** Place stat cards in a side column on wide screens */
  statsAside?: boolean;
}

function renderStats(stats: HeroStat[], aside: boolean) {
  return (
    <ul
      className={`page-hero-stats reveal reveal-delay-3${aside ? " page-hero-stats--aside" : ""}`}
    >
      {stats.map((stat) => (
        <li className="page-hero-stat" key={stat.label}>
          <data className="page-hero-stat-value">{stat.value}</data>
          <span className="page-hero-stat-label">{stat.label}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PageHero({
  variant = "light",
  eyebrow,
  title,
  lead,
  actions,
  image,
  stats,
  meta,
  compact = false,
  statsAside = false,
}: PageHeroProps) {
  const showMeta =
    meta?.availability || (meta?.remoteFriendly && meta?.location);

  const titleLines = title.split("\n");
  const showInlineStats = stats && stats.length > 0 && !statsAside;

  return (
    <section
      className={`page-hero page-hero--${variant}${image ? " page-hero--has-media" : ""}${compact ? " page-hero--compact" : ""}${statsAside ? " page-hero--stats-aside" : ""}`}
    >
      <div className="page-hero-inner grid-12">
        <div className="page-hero-copy reveal reveal-delay-1">
          {showMeta && (
            <div className="page-hero-meta reveal">
              {meta?.availability && (
                <span
                  className={`availability-badge availability-badge--${meta.availabilityStatus ?? "open"}`}
                >
                  <span className="availability-dot" aria-hidden="true" />
                  {meta.availability}
                </span>
              )}
              {meta?.remoteFriendly && meta?.location && (
                <span className="page-hero-meta-note">
                  Remote-friendly · {meta.location}
                </span>
              )}
            </div>
          )}

          <div className="page-hero-title-wrap">
            <h1 className="page-hero-title">
              {titleLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < titleLines.length - 1 && <br />}
                </span>
              ))}
            </h1>
            {eyebrow && (
              <Banner copy={eyebrow} className="page-hero-banner" />
            )}
          </div>

          {lead && <p className="page-hero-lead">{lead}</p>}

          {actions && actions.length > 0 && (
            <div className="page-hero-actions">
              {actions.map((action) => {
                const className = `btn-${action.variant === "secondary" ? "secondary" : "primary"}${variant === "dark" ? " btn-on-dark" : ""}`;

                if (action.href) {
                  const isExternal = action.href.startsWith("http");

                  if (isExternal) {
                    return (
                      <a
                        key={action.label}
                        href={action.href}
                        className={className}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {action.label}
                      </a>
                    );
                  }

                  return (
                    <Link key={action.label} href={action.href} className={className}>
                      {action.label}
                    </Link>
                  );
                }

                return (
                  <button
                    key={action.label}
                    type="button"
                    className={className}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </button>
                );
              })}
            </div>
          )}

          {showInlineStats && renderStats(stats, false)}
        </div>

        {statsAside && stats && stats.length > 0 && renderStats(stats, true)}

        {image && (
          <figure className="page-hero-media reveal reveal-scale reveal-delay-2">
            <PortfolioImage
              src={image.src}
              alt={image.alt}
              width={0}
              height={0}
              sizes="(max-width: 768px) 100vw, 560px"
              priority={image.priority}
              className="page-hero-media-image"
              style={{ width: "100%", height: "auto" }}
            />
          </figure>
        )}
      </div>
    </section>
  );
}
