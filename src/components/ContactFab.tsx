"use client";

import { PageName, Profile } from "@/types/portfolio";
import { useMessages } from "@/hooks/useMessages";

import IonIcon from "./IonIcon";

interface ContactFabProps {
  profile: Profile;
  activePage: PageName;
  onNavigate: (page: PageName) => void;
}

export default function ContactFab({
  profile,
  activePage,
  onNavigate,
}: ContactFabProps) {
  const t = useMessages();

  if (activePage === "contact") return null;

  return (
    <aside className="contact-fab" aria-label={t.nav.getInTouch}>
      <a
        href={`mailto:${profile.email}`}
        className="contact-fab-btn contact-fab-btn--secondary"
        aria-label={t.contact.sendEmail}
      >
        <IonIcon name="mail-outline" aria-hidden="true" />
      </a>
      <button
        type="button"
        className="contact-fab-btn contact-fab-btn--primary"
        onClick={() => onNavigate("contact")}
      >
        <IonIcon name="chatbubble-ellipses-outline" aria-hidden="true" />
        <span>{t.nav.getInTouch}</span>
      </button>
    </aside>
  );
}
