import PortfolioLayoutClient from "@/components/PortfolioLayoutClient";
import { getPortfolio } from "@/lib/portfolio.server";
import { isLocale } from "@/lib/locale";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PortfolioSectionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const initialData = await getPortfolio(lang);

  return (
    <PortfolioLayoutClient initialData={initialData} initialLocale={lang}>
      {children}
    </PortfolioLayoutClient>
  );
}
