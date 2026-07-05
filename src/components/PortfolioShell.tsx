"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { fetchPortfolio } from "@/lib/api";
import { getMessages } from "@/i18n/messages";
import { localeFromPath } from "@/lib/locale";
import { PortfolioData } from "@/types/portfolio";
import { Locale } from "@/types/localized";
import PortfolioApp from "./PortfolioApp";

interface PortfolioShellProps {
  initialData: PortfolioData | null;
  initialLocale: Locale;
}

export default function PortfolioShell({
  initialData,
  initialLocale,
}: PortfolioShellProps) {
  const pathname = usePathname();
  const locale = localeFromPath(pathname) || initialLocale;
  const t = getMessages(locale);
  const [dataByLocale, setDataByLocale] = useState<
    Partial<Record<Locale, PortfolioData>>
  >(() => (initialData ? { [initialLocale]: initialData } : {}));
  const [error, setError] = useState<string | null>(null);

  const data = dataByLocale[locale] ?? null;

  useEffect(() => {
    let cancelled = false;

    fetchPortfolio(locale)
      .then((result) => {
        if (!cancelled) {
          setDataByLocale((prev) => ({ ...prev, [locale]: result }));
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(t.misc.loadError);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [locale, t.misc.loadError]);

  if (error) {
    return (
      <div className="portfolio-load-error">
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="portfolio-loading" aria-busy="true">
        <p>{t.misc.loading}…</p>
      </div>
    );
  }

  return <PortfolioApp data={data} />;
}
