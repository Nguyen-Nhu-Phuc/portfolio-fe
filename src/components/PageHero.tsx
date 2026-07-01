import PortfolioImage from "./PortfolioImage";

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
}: PageHeroProps) {
  const showMeta =
    meta?.availability || (meta?.remoteFriendly && meta?.location);

  return (
    <section className={`page-hero page-hero--${variant}`}>
      <div className="page-hero-ambient" aria-hidden="true" />
      <div className="page-hero-inner">
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

          {eyebrow && <p className="page-hero-eyebrow">{eyebrow}</p>}
          <h1 className="page-hero-title">{title}</h1>
          {lead && <p className="page-hero-lead">{lead}</p>}

          {actions && actions.length > 0 && (
            <div className="page-hero-actions">
              {actions.map((action) => {
                const className = `btn-${action.variant === "secondary" ? "secondary" : "primary"}${variant === "dark" ? " btn-on-dark" : ""}`;

                if (action.href) {
                  return (
                    <a
                      key={action.label}
                      href={action.href}
                      className={className}
                      target={action.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        action.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      {action.label}
                    </a>
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

          {stats && stats.length > 0 && (
            <ul className="page-hero-stats reveal reveal-delay-3">
              {stats.map((stat) => (
                <li className="page-hero-stat" key={stat.label}>
                  <data className="page-hero-stat-value">{stat.value}</data>
                  <span className="page-hero-stat-label">{stat.label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {image && (
          <figure className="page-hero-media reveal reveal-scale reveal-delay-2">
            <PortfolioImage
              src={image.src}
              alt={image.alt}
              width={480}
              height={360}
              sizes="(max-width: 768px) 100vw, 480px"
              priority={image.priority}
            />
          </figure>
        )}
      </div>
    </section>
  );
}
