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
    observer.observe(el);
  });

  return observer;
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

  useEffect(() => {
    if (prefersReducedMotion()) {
      document
        .querySelectorAll(`article[data-page="${activePage}"] .reveal`)
        .forEach((el) => el.classList.add("is-visible"));
      return;
    }

    let observer: IntersectionObserver | undefined;

    const timer = window.setTimeout(() => {
      const root = document.querySelector(
        `article[data-page="${activePage}"].active`
      );
      if (!root) return;

      const allReveals = Array.from(root.querySelectorAll(".reveal"));
      const heroReveals = allReveals.filter((el) => el.closest(".page-hero"));
      const scrollReveals = allReveals.filter((el) => !el.closest(".page-hero"));

      requestAnimationFrame(() => revealImmediately(heroReveals));
      observer = observeElements(scrollReveals);
    }, 40);

    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, [activePage]);

  return null;
}
