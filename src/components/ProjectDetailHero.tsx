import ProjectTag from "./ui/ProjectTag";
import { Project } from "@/types/portfolio";

interface ProjectDetailHeroProps {
  project: Project;
  liveLabel: string;
}

export default function ProjectDetailHero({
  project,
  liveLabel,
}: ProjectDetailHeroProps) {
  const tags = project.techStack?.length
    ? project.techStack
    : [project.category];

  return (
    <section className="project-hero grid-12">
      <div className="project-hero-top">
        <div className="project-hero-title-wrapper">
          <h1 className="project-hero-title">{project.title}</h1>
        </div>
        <div className="project-hero-tags">
          {tags.map((tag) => (
            <ProjectTag key={tag} label={tag} />
          ))}
        </div>
      </div>

      {project.description && (
        <p className="project-hero-description">{project.description}</p>
      )}

      {project.url && project.url !== "#" && (
        <div className="project-hero-buttons">
          <a
            href={project.url}
            className="btn-primary project-hero-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            {liveLabel}
          </a>
        </div>
      )}
    </section>
  );
}
