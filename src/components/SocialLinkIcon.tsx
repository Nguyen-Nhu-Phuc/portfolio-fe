"use client";

import { useState } from "react";
import IonIcon from "@/components/IonIcon";
import PortfolioImage from "@/components/PortfolioImage";
import { SocialLink } from "@/types/portfolio";

interface SocialLinkIconProps {
  link: SocialLink;
  className?: string;
  size?: number;
}

export default function SocialLinkIcon({
  link,
  className,
  size = 18,
}: SocialLinkIconProps) {
  const [logoFailed, setLogoFailed] = useState(false);
  const logo = link.logo?.trim();

  if (logo && !logoFailed) {
    return (
      <PortfolioImage
        src={logo}
        alt=""
        aria-hidden
        className={className ?? "social-link-logo"}
        width={size}
        height={size}
        unoptimized
        onError={() => setLogoFailed(true)}
      />
    );
  }

  if (link.icon?.trim()) {
    return <IonIcon name={link.icon} className={className} aria-hidden="true" />;
  }

  return null;
}