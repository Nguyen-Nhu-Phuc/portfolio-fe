"use client";

import { useState } from "react";
import IonIcon from "./IonIcon";
import PortfolioImage from "./PortfolioImage";
import PageHero from "./PageHero";
import HireCta from "./HireCta";
import FeaturedWorkStrip from "./FeaturedWorkStrip";
import { useModalA11y } from "@/hooks/useModalA11y";
import {
  Service,
  Testimonial,
  Client,
  Profile,
  Skill,
  PageName,
} from "@/types/portfolio";
import { getHeroStats, getTopSkills } from "@/lib/portfolioHelpers";
import { PortfolioData } from "@/types/portfolio";
import { useMessages } from "@/hooks/useMessages";
import { useLocale } from "@/context/LocaleProvider";

interface AboutProps {
  profile: Profile;
  about: string[];
  services: Service[];
  testimonials: Testimonial[];
  clients: Client[];
  skills: Skill[];
  portfolioSnapshot: Pick<PortfolioData, "experience" | "projects" | "clients">;
  isActive?: boolean;
  onNavigate: (page: PageName) => void;
}

function formatDate(dateStr: string, locale: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function About({
  profile,
  about,
  services,
  testimonials,
  clients,
  skills,
  portfolioSnapshot,
  isActive = false,
  onNavigate,
}: AboutProps) {
  const t = useMessages();
  const { locale } = useLocale();
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Testimonial | null>(null);

  const heroStats = getHeroStats(
    {
      profile,
      about,
      services,
      testimonials,
      skills,
      education: [],
      blogs: [],
      ...portfolioSnapshot,
    },
    t.stats
  );

  const topSkills = getTopSkills(skills);

  const openModal = (item: Testimonial) => {
    setSelected(item);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const testimonialDialogRef = useModalA11y(modalOpen, closeModal);

  return (
    <article className={`about${isActive ? " active" : ""}`} data-page="about">
      <PageHero
        variant="light"
        eyebrow={profile.title}
        title={profile.name}
        lead={profile.tagline ?? about[0]}
        image={{ src: profile.avatar, alt: profile.name, priority: true }}
        meta={{
          availability: profile.availability,
          availabilityStatus: profile.availabilityStatus,
          remoteFriendly: profile.remoteFriendly,
          location: profile.location,
        }}
        actions={[
          {
            label: t.hero.contactMe,
            onClick: () => onNavigate("contact"),
          },
          {
            label: t.hero.viewPortfolio,
            variant: "secondary",
            onClick: () => onNavigate("portfolio"),
          },
          ...(profile.resumeUrl
            ? [
                {
                  label: t.hero.downloadResume,
                  variant: "secondary" as const,
                  href: profile.resumeUrl,
                },
              ]
            : []),
        ]}
        stats={heroStats}
      />

      <div className="tile-stack">
        {topSkills.length > 0 && (
          <section className="tile tile--light reveal">
            <div className="tile-inner">
              <h2 className="tile-heading">{t.sections.coreExpertise}</h2>
              <ul className="skill-tags reveal-stagger">
                {topSkills.map((skill) => (
                  <li className="skill-tag reveal" key={skill.name}>
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="tile tile--parchment reveal">
          <div className="tile-inner">
            <h2 className="tile-heading">{t.sections.aboutMe}</h2>
            <div className="about-text">
              {about.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <ul className="trust-list reveal-stagger">
              <li className="reveal">
                <IonIcon name="checkmark-circle-outline" />
                <span>{t.trust.available}</span>
              </li>
              <li className="reveal">
                <IonIcon name="checkmark-circle-outline" />
                <span>{t.trust.communication}</span>
              </li>
              <li className="reveal">
                <IonIcon name="checkmark-circle-outline" />
                <span>{t.trust.production}</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="tile tile--light reveal">
          <div className="tile-inner">
            <h2 className="tile-heading">{t.sections.whatIDeliver}</h2>
            <ul className="utility-grid reveal-stagger">
              {services.map((service) => (
                <li className="utility-card reveal" key={service.title}>
                  <div className="utility-card-icon">
                    <PortfolioImage
                      src={service.icon}
                      alt=""
                      width={40}
                      height={40}
                    />
                  </div>
                  <h3 className="utility-card-title">{service.title}</h3>
                  <p className="utility-card-text">{service.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <FeaturedWorkStrip
          projects={portfolioSnapshot.projects}
          onNavigate={onNavigate}
        />

        <section className="tile tile--dark-2 reveal">
          <div className="tile-inner">
            <h2 className="tile-heading tile-heading--on-dark">
              {t.sections.clientFeedback}
            </h2>
            <ul className="testimonials-list has-scrollbar reveal-stagger">
              {testimonials.map((item) => (
                <li className="testimonials-item reveal" key={item.name}>
                  <button
                    type="button"
                    className="testimonial-card"
                    onClick={() => openModal(item)}
                  >
                    <figure className="testimonials-avatar-box">
                      <PortfolioImage
                        src={item.avatar}
                        alt={item.name}
                        width={60}
                        height={60}
                      />
                    </figure>
                    {item.role && (
                      <p className="testimonial-role">{item.role}</p>
                    )}
                    <h3 className="testimonials-item-title">{item.name}</h3>
                    <div className="testimonials-text">
                      <p>{item.text}</p>
                    </div>
                    <span className="text-link-on-dark">{t.actions.readMore}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="tile tile--parchment reveal">
          <div className="tile-inner">
            <h2 className="tile-heading">{t.sections.trustedBy}</h2>
            <ul className="clients-list has-scrollbar reveal-stagger">
              {clients.map((client, index) => (
                <li className="clients-item reveal" key={index}>
                  <a href={client.url} className="client-logo-card">
                    <PortfolioImage
                      src={client.logo}
                      alt="Client logo"
                      width={150}
                      height={50}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <HireCta
          onNavigate={onNavigate}
          email={profile.email}
          resumeUrl={profile.resumeUrl}
        />
      </div>

      <div className={`modal-container${modalOpen ? " active" : ""}`}>
        <div
          className={`overlay${modalOpen ? " active" : ""}`}
          onClick={closeModal}
        ></div>

        <section
          className="testimonials-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="testimonial-modal-title"
          ref={testimonialDialogRef}
        >
          <button
            type="button"
            className="modal-close-btn"
            aria-label="Close"
            onClick={closeModal}
          >
            <IonIcon name="close-outline" />
          </button>

          {selected && (
            <>
              <div className="modal-img-wrapper">
                <figure className="modal-avatar-box">
                  <PortfolioImage
                    src={selected.avatar}
                    alt={selected.name}
                    width={80}
                    height={80}
                  />
                </figure>
                <PortfolioImage
                  src="/images/icon-quote.svg"
                  alt=""
                  width={35}
                  height={35}
                />
              </div>
              <div className="modal-content">
                {selected.role && (
                  <p className="testimonial-role">{selected.role}</p>
                )}
                <h3 className="h3 modal-title" id="testimonial-modal-title">{selected.name}</h3>
                <time dateTime={selected.date}>
                  {formatDate(selected.date, locale)}
                </time>
                <p>{selected.text}</p>
              </div>
            </>
          )}
        </section>
      </div>
    </article>
  );
}
