interface ProjectTagProps {
  label: string;
}

export default function ProjectTag({ label }: ProjectTagProps) {
  return (
    <span className="project-tag">
      <span className="project-tag-copy">{label}</span>
    </span>
  );
}
