"use client";

import { useEffect } from "react";
import { PageName } from "@/types/portfolio";

interface ScrollRevealObserverProps {
  activePage: PageName;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function revealImmediately(elements: Element[]) {
  elements.forEach((el) => el.classList.add("is-visible"));
}

function observeElements(elements: Element[]): IntersectionObserver | undefined {
  if (elements.length === 0) return undefined;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((el) => {
    el.classList.remove("is-visible");

    const rect = el.getBoundingClientRect();
    const inView =
      rect.width > 0 &&
      rect.height > 0 &&
      rect.top < window.innerHeight &&
      rect.bottom > 0;

    if (inView) {
      el.classList.add("is-visible");
      return;
    }

    observer.observe(el);
  });

  return observer;
}

function setupPageReveals(activePage: PageName): () => void {
  if (prefersReducedMotion()) {
    document
      .querySelectorAll(`article[data-page="${activePage}"] .reveal`)
      .forEach((el) => el.classList.add("is-visible"));
    return () => {};
  }

  let observer: IntersectionObserver | undefined;
  let cancelled = false;
  const timers: number[] = [];

  const run = (attempt = 0) => {
    if (cancelled) return;

    const root = document.querySelector(
      `article[data-page="${activePage}"].active`
    );
    if (!root) {
      if (attempt < 30) {
        timers.push(window.setTimeout(() => run(attempt + 1), 50));
      }
      return;
    }

    const allReveals = Array.from(root.querySelectorAll(".reveal"));
    if (allReveals.length === 0 && attempt < 30) {
      timers.push(window.setTimeout(() => run(attempt + 1), 50));
      return;
    }

    const heroReveals = allReveals.filter((el) => el.closest(".page-hero"));
    const scrollReveals = allReveals.filter((el) => !el.closest(".page-hero"));

    requestAnimationFrame(() => revealImmediately(heroReveals));
    observer?.disconnect();
    observer = observeElements(scrollReveals);
  };

  timers.push(window.setTimeout(() => run(0), 40));

  return () => {
    cancelled = true;
    timers.forEach((id) => window.clearTimeout(id));
    observer?.disconnect();
  };
}

export default function ScrollRevealObserver({
  activePage,
}: ScrollRevealObserverProps) {
  useEffect(() => {
    if (prefersReducedMotion()) {
      document
        .querySelectorAll(".site-footer .reveal")
        .forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const footerReveals = Array.from(
      document.querySelectorAll(".site-footer .reveal")
    );
    const footerObserver = observeElements(footerReveals);
    return () => footerObserver?.disconnect();
  }, []);

  useEffect(() => setupPageReveals(activePage), [activePage]);

  return null;
}
