"use client";

import Link from "next/link";
import PortfolioImage from "../PortfolioImage";
import ArrowRightLong from "../icons/ArrowRightLong";
import ButtonRound from "./ButtonRound";
import Notch from "./Notch";

interface PreviewCardProps {
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  onClick?: () => void;
  href?: string;
  empty?: boolean;
  emptyLabel?: string;
}

export default function PreviewCard({
  title,
  description,
  image,
  imageAlt,
  onClick,
  href,
  empty = false,
  emptyLabel,
}: PreviewCardProps) {
  const body = (
    <>
      <div className="preview-card-top">
        {empty ? (
          <div className="preview-card-top-empty" aria-hidden="true">
            <span className="preview-card-top-empty-icon">+</span>
          </div>
        ) : (
          <>
            <div className="preview-card-image-wrapper">
              <div className="preview-card-image-container">
                {image && (
                  <PortfolioImage
                    src={image}
                    alt={imageAlt ?? title}
                    width={0}
                    height={0}
                    sizes="(max-width: 768px) 100vw, 400px"
                    loading="lazy"
                    className="preview-card-image"
                    style={{ width: "100%", height: "auto" }}
                  />
                )}
              </div>
            </div>
            <div className="preview-card-overlay">
              <div className="preview-card-edge">
                <ButtonRound variant="accent" as="div" className="preview-card-button">
                  <ArrowRightLong className="preview-card-button-arrow" />
                </ButtonRound>
              </div>
              <Notch className="preview-card-notch preview-card-notch-left" />
              <Notch className="preview-card-notch preview-card-notch-right" />
            </div>
          </>
        )}
      </div>
      <div className="preview-card-content">
        <div className="preview-card-copys">
          <h3 className="preview-card-title">
            {empty ? (emptyLabel ?? title) : title}
          </h3>
          {!empty && description && (
            <p className="preview-card-description">{description}</p>
          )}
        </div>
      </div>
    </>
  );

  if (href && !empty) {
    const isExternal = href.startsWith("http");

    if (isExternal) {
      return (
        <a
          className="preview-card"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {body}
        </a>
      );
    }

    return (
      <Link href={href} className="preview-card">
        {body}
      </Link>
    );
  }

  return (
    <button type="button" className="preview-card" onClick={onClick}>
      {body}
    </button>
  );
}
