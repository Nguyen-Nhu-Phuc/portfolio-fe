"use client";

import { FormEvent, useState } from "react";
import IonIcon from "./IonIcon";
import PageHero from "./PageHero";
import { Profile } from "@/types/portfolio";
import { submitContact } from "@/lib/api";
import { useMessages } from "@/hooks/useMessages";
import { useToast } from "@/context/ToastProvider";

interface ContactProps {
  profile: Profile;
  isActive?: boolean;
}

export default function Contact({ profile, isActive = false }: ContactProps) {
  const t = useMessages();
  const toast = useToast();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  const isValid =
    fullname.trim() !== "" && email.trim() !== "" && message.trim() !== "";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid || honeypot) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      await submitContact({
        fullname,
        email,
        message,
        projectType: projectType || undefined,
        budget: budget || undefined,
        timeline: timeline || undefined,
        _website: honeypot,
      });
      setStatus("success");
      setFullname("");
      setEmail("");
      setProjectType("");
      setBudget("");
      setTimeline("");
      setMessage("");
      toast.success(t.contact.success);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send message";
      setStatus("error");
      setErrorMessage(message);
      toast.error(message);
    }
  };

  return (
    <article className={`contact${isActive ? " active" : ""}`} data-page="contact">
      <PageHero
        variant="dark"
        eyebrow={t.contact.eyebrow}
        title={t.contact.title}
        lead={t.contact.lead.replace("{location}", profile.location)}
        actions={[
          { label: t.contact.sendEmail, href: `mailto:${profile.email}` },
          {
            label: t.contact.callNow,
            variant: "secondary",
            href: `tel:${profile.phone.replace(/\s/g, "")}`,
          },
        ]}
      />

      <div className="tile-stack">
        <section className="tile tile--light reveal">
          <div className="tile-inner tile-inner--split">
            <div className="contact-details reveal reveal-delay-1">
              <h2 className="tile-heading">{t.sections.getInTouch}</h2>
              <p className="contact-intro">{t.contact.formIntro}</p>
              <p className="contact-response-time">{t.contact.responseTime}</p>
              {profile.birthdayDisplay && (
                <p className="contact-birthday">{profile.birthdayDisplay}</p>
              )}
              <ul className="contact-detail-list">
                <li>
                  <span className="contact-detail-label">{t.contact.email}</span>
                  <a href={`mailto:${profile.email}`} className="text-link">
                    {profile.email}
                  </a>
                </li>
                <li>
                  <span className="contact-detail-label">{t.contact.phone}</span>
                  <a
                    href={`tel:${profile.phone.replace(/\s/g, "")}`}
                    className="text-link"
                  >
                    {profile.phone}
                  </a>
                </li>
                <li>
                  <span className="contact-detail-label">{t.contact.location}</span>
                  <address>{profile.location}</address>
                </li>
              </ul>

              {profile.socialLinks.length > 0 && (
                <div className="contact-social">
                  <p className="contact-detail-label">{t.contact.social}</p>
                  <ul className="contact-social-list">
                    {profile.socialLinks.map((link) => (
                      <li key={link.platform}>
                        <a
                          href={link.url}
                          className="contact-social-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <IonIcon name={link.icon} aria-hidden="true" />
                          <span>
                            {link.platform.charAt(0).toUpperCase() +
                              link.platform.slice(1)}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <section className="contact-form reveal reveal-delay-2">
              <form className="form" onSubmit={handleSubmit} noValidate>
                <h3 className="form-title">{t.contact.formTitle}</h3>

                <div className="form-honeypot" aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    type="text"
                    name="_website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div className="input-wrapper">
                  <label className="form-label" htmlFor="contact-fullname">
                    {t.contact.formName}
                  </label>
                  <input
                    id="contact-fullname"
                    type="text"
                    name="fullname"
                    className="form-input"
                    required
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                  />

                  <label className="form-label" htmlFor="contact-email">
                    {t.contact.formEmail}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    className="form-input"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <label className="form-label" htmlFor="contact-project-type">
                  {t.contact.formProjectType}
                </label>
                <input
                  id="contact-project-type"
                  type="text"
                  name="projectType"
                  className="form-input"
                  placeholder={t.contact.formProjectTypePlaceholder}
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                />

                <div className="input-wrapper">
                  <label className="form-label" htmlFor="contact-budget">
                    {t.contact.formBudget}
                  </label>
                  <input
                    id="contact-budget"
                    type="text"
                    name="budget"
                    className="form-input"
                    placeholder={t.contact.formBudgetPlaceholder}
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />

                  <label className="form-label" htmlFor="contact-timeline">
                    {t.contact.formTimeline}
                  </label>
                  <input
                    id="contact-timeline"
                    type="text"
                    name="timeline"
                    className="form-input"
                    placeholder={t.contact.formTimelinePlaceholder}
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                  />
                </div>

                <label className="form-label" htmlFor="contact-message">
                  {t.contact.formMessage}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  className="form-input"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                <button
                  className="btn-primary form-btn"
                  type="submit"
                  disabled={!isValid || status === "loading"}
                >
                  <IonIcon name="paper-plane" />
                  <span>
                    {status === "loading" ? t.actions.sending : t.actions.sendMessage}
                  </span>
                </button>

                {status === "success" && (
                  <p className="form-feedback success" role="status">
                    {t.contact.success}
                  </p>
                )}
                {status === "error" && (
                  <p className="form-feedback error" role="alert">
                    {errorMessage}
                  </p>
                )}
              </form>
            </section>
          </div>
        </section>

        <section className="tile tile--parchment reveal">
          <div className="tile-inner">
            <div className="mapbox reveal">
              <figure>
                <iframe
                  src={profile.mapEmbedUrl}
                  width={400}
                  height={300}
                  loading="lazy"
                  title="Location map"
                ></iframe>
              </figure>
            </div>
          </div>
        </section>
      </div>

      {isActive && (
        <div className="floating-sticky-bar">
          <p className="floating-sticky-label">
            {t.contact.readyCollaborate}{" "}
            <span className="floating-sticky-muted">{profile.email}</span>
          </p>
          <a href={`mailto:${profile.email}`} className="btn-primary">
            {t.contact.sendEmail}
          </a>
        </div>
      )}
    </article>
  );
}
