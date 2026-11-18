import type { Metadata } from "next";
import { Suspense } from "react";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Preloader } from "@/components/site/preloader";
import { ScrollProgress } from "@/components/magicui/scroll-progress";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { SITE_URL } from "@/lib/seo";
import { SiteJsonLd } from "@/components/seo/site-json-ld";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["opsz"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Travelution — Tours, Umrah, Hajj & Visas from Karachi", template: "%s | Travelution" },
  description:
    "Travelution is a Karachi-based travel company crafting private tours, Hajj & Umrah journeys, visas and insurance — worldwide.",
  applicationName: "Travelution",
  alternates: { canonical: "/" },
  openGraph: { siteName: "Travelution", type: "website", locale: "en_PK" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-video-preview": -1, "max-snippet": -1 } },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} ${fraunces.variable}`}>
      <body className="min-h-dvh flex flex-col">
        <Preloader />
        <ScrollProgress />
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <SiteJsonLd />
      </body>
    </html>
  );
}
