"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import IonIcon from "./IonIcon";
import { useLocale } from "@/context/LocaleProvider";
import { Locale } from "@/types/localized";
import { pageFromPath, pathForPage } from "@/lib/portfolioPages";
import { localeFromPath } from "@/lib/locale";

const OPTIONS: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "vi", label: "Tiếng Việt" },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = OPTIONS.find((o) => o.code === locale) ?? OPTIONS[0];

  useEffect(() => {
    const urlLocale = localeFromPath(pathname);
    if (urlLocale !== locale) {
      setLocale(urlLocale);
    }
  }, [pathname, locale, setLocale]);

  useEffect(() => {
    if (!open) return;

    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const selectLocale = (code: Locale) => {
    setLocale(code);
    const page = pageFromPath(pathname);
    router.push(pathForPage(page, code));
    setOpen(false);
  };

  return (
    <div className="lang-menu" ref={ref}>
      <button
        type="button"
        className="lang-menu-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Language: ${current.label}`}
        title={current.label}
      >
        <IonIcon name="language-outline" />
      </button>

      {open && (
        <ul className="lang-menu-dropdown" role="listbox" aria-label="Language">
          {OPTIONS.map((option) => (
            <li key={option.code}>
              <button
                type="button"
                role="option"
                aria-selected={locale === option.code}
                className={`lang-menu-option${locale === option.code ? " active" : ""}`}
                onClick={() => selectLocale(option.code)}
              >
                <span>{option.label}</span>
                {locale === option.code && (
                  <IonIcon name="checkmark" aria-hidden="true" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
