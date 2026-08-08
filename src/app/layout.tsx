import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalGridCursorOverlay from "../components/GlobalGridCursorOverlay";
import CustomCursor from "../components/CustomCursor";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jake Floch - Software Engineer",
  description:
    "Portfolio of Jake Floch — Computer Science student at Emory and Data Engineer Intern at Expedia Group. Data pipelines, backend, and full-stack projects.",
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
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Jake Floch - Software Engineer",
    description:
      "Jake Floch's portfolio showcasing modern web development",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jake Floch - Software Engineer",
    description:
      "Jake Floch's portfolio showcasing modern web development",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased cursor-none bg-[#0f0f11] text-zinc-100 relative`}
      >
        <GlobalGridCursorOverlay
          cellSize={20} // Grid Cell size in px
          fadeOutSeconds={0.9} // Fade duration
          intensity={0.9} // Lit cell peak opacity
        />
        {/* Custom pointer (hidden unless over interactive elements) */}
        <CustomCursor />
        <div className="relative z-20">{children}</div>
        <Analytics /> {/* Vercel Web Analytics */}
        <SpeedInsights /> {/* Vercel Speed Insights */}
      </body>
    </html>
  );
}
