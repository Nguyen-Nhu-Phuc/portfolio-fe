import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Roboto_Mono, Urbanist } from "next/font/google";
import "@/styles/style.css";
import "@/styles/portfolio-theme.css";
import "@/styles/toast.css";
import ThemeProvider from "@/components/ThemeProvider";
import { LocaleProvider } from "@/context/LocaleProvider";
import { ToastProvider } from "@/context/ToastProvider";
import { THEME_STORAGE_KEY } from "@/lib/theme";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-urbanist",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-banner",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: "vCard - Personal Portfolio",
  description: "Personal portfolio website",
  icons: {
    icon: "/images/logo.ico",
  },
};

const themeInitScript = `(function(){try{var k="${THEME_STORAGE_KEY}";var s=localStorage.getItem(k);var d=window.matchMedia("(prefers-color-scheme: dark)").matches;var t=s==="light"||s==="dark"?s:(d?"dark":"light");document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${urbanist.variable} ${inter.variable} ${robotoMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://unpkg.com" />
        <link rel="dns-prefetch" href="https://unpkg.com" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={urbanist.className}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ThemeProvider>
          <LocaleProvider>
            <ToastProvider>{children}</ToastProvider>
          </LocaleProvider>
        </ThemeProvider>
        <Script
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
          strategy="lazyOnload"
          type="module"
        />
      </body>
    </html>
  );
}
