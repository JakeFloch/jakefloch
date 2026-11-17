import type { Metadata, Viewport } from "next";
import { Funnel_Display, Funnel_Sans, Martian_Mono } from "next/font/google";
import "./globals.css";
import CursorFollower from "../components/CursorFollower";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const funnelSans = Funnel_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-code",
  subsets: ["latin"],
});

const funnelDisplay = Funnel_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

const description =
  "Portfolio of Jake Floch — Computer Science student at Emory University. Data pipelines, AI tooling, and full-stack projects.";

export const metadata: Metadata = {
  title: "Jake Floch — Software Engineer",
  description,
  keywords: [
    "Jake Floch",
    "Software Engineer",
    "Data Engineer",
    "Python",
    "SQL",
    "Trino",
    "Spark",
    "React",
    "Next.js",
    "TypeScript",
    "Portfolio",
  ],
  authors: [{ name: "Jake Floch" }],
  robots: "index, follow",
  openGraph: {
    title: "Jake Floch — Software Engineer",
    description,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jake Floch — Software Engineer",
    description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${funnelSans.variable} ${martianMono.variable} ${funnelDisplay.variable}`}
    >
      <body className="antialiased">
        {children}
        <CursorFollower />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
