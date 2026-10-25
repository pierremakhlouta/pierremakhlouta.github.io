import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";
import { SiteFooter } from "@/components/layout";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const description =
  "Computer Science student at York University, drawn to systems, software and how technology works. Projects, experience, skills and contact details.";

// Absolute base for share-image URLs. SITE_URL overrides it (e.g. a custom
// domain); BASE_PATH is appended for sub-path hosting.
const siteUrl = `${process.env.SITE_URL ?? "https://pierremakhlouta.github.io"}${process.env.BASE_PATH ?? ""}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pierre Makhlouta",
    template: "%s | Pierre Makhlouta",
  },
  description,
  openGraph: {
    title: "Pierre Makhlouta",
    description,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ebeef0" },
    { media: "(prefers-color-scheme: dark)", color: "#121b23" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${schibsted.variable} ${jetbrains.variable} antialiased`}>
      <body>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
