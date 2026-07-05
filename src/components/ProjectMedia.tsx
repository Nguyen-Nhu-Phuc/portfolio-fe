import PortfolioImage from "./PortfolioImage";
import Notch from "./ui/Notch";

interface ProjectMediaProps {
  src: string;
  alt: string;
  caption?: string;
}

export default function ProjectMedia({ src, alt, caption }: ProjectMediaProps) {
  return (
    <figure className="project-media">
      <div className="project-media-content">
        <PortfolioImage
          src={src}
          alt={alt}
          width={0}
          height={0}
          sizes="(max-width: 900px) 100vw, 900px"
          priority
          className="project-media-image"
          style={{ width: "100%", height: "auto" }}
        />
      </div>
      {caption && (
        <figcaption className="project-media-caption">
          <Notch className="project-media-caption-notch project-media-caption-notch-left" />
          <Notch className="project-media-caption-notch project-media-caption-notch-top" />
          <p className="project-media-caption-copy">{caption}</p>
        </figcaption>
      )}
    </figure>
  );
}
