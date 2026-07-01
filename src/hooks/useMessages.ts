"use client";

import { useLocale } from "@/context/LocaleProvider";
import { getMessages } from "@/i18n/messages";

export function useMessages() {
  const { locale } = useLocale();
  return getMessages(locale);
}
