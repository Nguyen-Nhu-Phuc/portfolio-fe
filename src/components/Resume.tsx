"use client";

import { useEffect, useState } from "react";
import PageHero from "./PageHero";
import HireCta from "./HireCta";
import { TimelineItem, Skill, Profile, PageName } from "@/types/portfolio";
import { useMessages } from "@/hooks/useMessages";
import IonIcon from "./IonIcon";

interface ResumeProps {
  profile: Profile;
  education: TimelineItem[];
  experience: TimelineItem[];
  skills: Skill[];
  isActive?: boolean;
  onNavigate: (page: PageName) => void;
}
function TimelineSection({
  title,
  icon,
  items,
}: {
  title: string;
  icon: string;
  items: TimelineItem[];
}) {
  return (
    <section className="timeline reveal">
      <div className="title-wrapper">
        <div className="icon-box">
          <IonIcon name={icon} />
        </div>
        <h3 className="h3">{title}</h3>
      </div>

      <ol className="timeline-list reveal-stagger">
        {items.map((item) => (
          <li className="timeline-item reveal" key={item.title}>
            <h4 className="h4 timeline-item-title">{item.title}</h4>
            <span>{item.period}</span>
            <p className="timeline-text">{item.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function Resume({
  profile,
  education,
  experience,
  skills,
  isActive = false,
  onNavigate,
}: ResumeProps) {
  const t = useMessages();
  const [skillsAnimated, setSkillsAnimated] = useState(false);
  const topSkill = [...skills].sort((a, b) => b.percentage - a.percentage)[0];

  useEffect(() => {
    if (!isActive) return;
    const timer = setTimeout(() => setSkillsAnimated(true), 150);
    return () => {
      clearTimeout(timer);
      setSkillsAnimated(false);
    };
  }, [isActive]);

  const lead = t.resume.lead
    .replace("{count}", String(experience.length))
    .replace("{skill}", topSkill?.name ?? "creative work");

  return (
    <article className={`resume${isActive ? " active" : ""}`} data-page="resume">
      <PageHero
        variant="parchment"
        eyebrow={t.resume.eyebrow}
        title={t.resume.title}
        lead={lead}
        actions={[
          {
            label: t.hero.contactMe,
            onClick: () => onNavigate("contact"),
          },
          ...(profile.resumeUrl
            ? [
                {
                  label: t.hero.downloadPdf,
                  variant: "secondary" as const,
                  href: profile.resumeUrl,
                },
              ]
            : []),
        ]}
        stats={[
          { value: String(education.length), label: t.stats.education },
          { value: String(experience.length), label: t.stats.experience },
          {
            value: `${topSkill?.percentage ?? 0}%`,
            label: topSkill?.name ?? t.sections.mySkills,
          },
        ]}
      />

      <div className="tile-stack">
        <section className="tile tile--light reveal">
          <div className="tile-inner">
            <TimelineSection
              title={t.sections.education}
              icon="book-outline"
              items={education}
            />
            <TimelineSection
              title={t.sections.experience}
              icon="briefcase-outline"
              items={experience}
            />
          </div>
        </section>

        <section className="tile tile--dark-2 reveal">
          <div className="tile-inner">
            <h2 className="tile-heading tile-heading--on-dark">
              {t.sections.mySkills}
            </h2>
            <ul className="skills-list skills-list--dark reveal-stagger">
              {skills.map((skill) => (
                <li className="skills-item reveal" key={skill.name}>
                  <div className="title-wrapper">
                    <h5 className="h5 skills-label--on-dark">{skill.name}</h5>
                    <data
                      className="skills-data--on-dark"
                      value={skill.percentage}
                    >
                      {skill.percentage}%
                    </data>
                  </div>
                  <div className="skill-progress-bg skill-progress-bg--dark">
                    <div
                      className="skill-progress-fill skill-progress-fill--on-dark"
                      style={{
                        width: skillsAnimated ? `${skill.percentage}%` : "0%",
                      }}
                    ></div>
                  </div>
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
    </article>
  );
}