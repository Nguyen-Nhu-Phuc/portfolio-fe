"use client";

import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { PortfolioData, PageName } from "@/types/portfolio";
import { pageFromPath, pathForPage } from "@/lib/portfolioPages";
import { localeFromPath } from "@/lib/locale";
import { useLocale } from "@/context/LocaleProvider";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FooterCta from "./FooterCta";
import ContactFab from "./ContactFab";
import ScrollRevealObserver from "./ScrollRevealObserver";

const About = dynamic(() => import("./About"));
const Resume = dynamic(() => import("./Resume"));
const PortfolioSection = dynamic(() => import("./PortfolioSection"));
const Blog = dynamic(() => import("./Blog"));
const Contact = dynamic(() => import("./Contact"));

interface PortfolioAppProps {
  data: PortfolioData;
}

export default function PortfolioApp({ data }: PortfolioAppProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { locale } = useLocale();
  const activePage = pageFromPath(pathname);
  const routeLocale = localeFromPath(pathname);

  const handleNavigate = (page: PageName) => {
    const nextPath = pathForPage(page, routeLocale || locale);
    if (pathname !== nextPath) {
      router.push(nextPath);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="site-canvas">
      <ScrollRevealObserver activePage={activePage} />
      <Navbar
        profile={data.profile}
        activePage={activePage}
        onNavigate={handleNavigate}
      />

      <main className="page-shell" id="main-content">
        <div className="main-content page-enter" key={activePage}>
          {activePage === "about" && (
            <About
              isActive
              profile={data.profile}
              about={data.about}
              services={data.services}
              testimonials={data.testimonials}
              clients={data.clients}
              skills={data.skills}
              portfolioSnapshot={{
                experience: data.experience,
                projects: data.projects,
                clients: data.clients,
              }}
              onNavigate={handleNavigate}
            />
          )}

          {activePage === "resume" && (
            <Resume
              isActive
              profile={data.profile}
              education={data.education}
              experience={data.experience}
              skills={data.skills}
              onNavigate={handleNavigate}
            />
          )}

          {activePage === "portfolio" && (
            <PortfolioSection
              isActive
              projects={data.projects}
              onNavigate={handleNavigate}
            />
          )}

          {activePage === "blog" && <Blog isActive blogs={data.blogs} />}

          {activePage === "contact" && (
            <Contact isActive profile={data.profile} />
          )}
        </div>
      </main>

      <FooterCta profile={data.profile} onNavigate={handleNavigate} />
      <Footer profile={data.profile} onNavigate={handleNavigate} />
      <ContactFab
        profile={data.profile}
        activePage={activePage}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
