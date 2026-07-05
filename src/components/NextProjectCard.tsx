import Link from "next/link";
import PortfolioImage from "./PortfolioImage";
import IonIcon from "./IonIcon";
import { Project } from "@/types/portfolio";
import { pathForProject } from "@/lib/projectSlug";
import { Locale } from "@/types/localized";

interface NextProjectCardProps {
  project: Project;
  locale: Locale;
  prefix: string;
}

export default function NextProjectCard({
  project,
  locale,
  prefix,
}: NextProjectCardProps) {
  return (
    <Link
      href={pathForProject(project, locale)}
      className="next-project"
      replace
    >
      <PortfolioImage
        src={project.image}
        alt=""
        width={0}
        height={0}
        sizes="120px"
        className="next-project-image"
        style={{ width: "auto", height: "auto", maxHeight: "100%" }}
      />
      <div className="next-project-content">
        <p className="next-project-prefix">{prefix}:</p>
        <h3 className="next-project-title">{project.title}</h3>
      </div>
      <IonIcon name="arrow-forward-outline" className="next-project-arrow" />
    </Link>
  );
}
