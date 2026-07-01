import { PortfolioData, Project } from "@/types/portfolio";

export type HeroStatLabels = {
  yearsExperience: string;
  projectsDelivered: string;
  happyClients: string;
};

export function getYearsExperience(experience: PortfolioData["experience"]): number {
  const startYears = experience
    .map((item) => {
      const match = item.period.match(/\b(19|20)\d{2}\b/g);
      return match ? parseInt(match[0], 10) : null;
    })
    .filter((year): year is number => year !== null);

  if (startYears.length === 0) return 0;
  return Math.max(1, new Date().getFullYear() - Math.min(...startYears));
}

export function getHeroStats(
  data: PortfolioData,
  labels: HeroStatLabels
) {
  const years =
    data.profile.yearsExperience ?? getYearsExperience(data.experience);

  return [
    { value: `${years}+`, label: labels.yearsExperience },
    { value: String(data.projects.length), label: labels.projectsDelivered },
    { value: String(data.clients.length), label: labels.happyClients },
  ];
}

export function getTopSkills(skills: PortfolioData["skills"], limit = 6) {
  return [...skills]
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, limit);
}

export function getFeaturedProject(projects: PortfolioData["projects"]) {
  return projects.find((p) => p.featured) ?? projects[0] ?? null;
}

export function getPreviewProjects(projects: Project[], limit = 3): Project[] {
  const featured = projects.filter((p) => p.featured);
  const source = featured.length > 0 ? featured : projects;
  return source.slice(0, limit);
}
