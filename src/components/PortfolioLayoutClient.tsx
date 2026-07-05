"use client";

import { LocaleProvider } from "@/context/LocaleProvider";
import PortfolioShell from "@/components/PortfolioShell";
import { PortfolioData } from "@/types/portfolio";
import { Locale } from "@/types/localized";

interface PortfolioLayoutClientProps {
  initialData: PortfolioData | null;
  initialLocale: Locale;
  children: React.ReactNode;
}

export default function PortfolioLayoutClient({
  initialData,
  initialLocale,
  children,
}: PortfolioLayoutClientProps) {
  return (
    <LocaleProvider initialLocale={initialLocale}>
      <PortfolioShell initialData={initialData} initialLocale={initialLocale} />
      {children}
    </LocaleProvider>
  );
}
