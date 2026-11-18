import type { Metadata } from "next";
import { Suspense } from "react";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import "../globals.css";
import { AdminShell } from "@/components/admin/shell";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["opsz"] });

// Admin screens read the session/db per request; opt out of instant-navigation validation (dev overlay).
export const instant = false;

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Travelution Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${fraunces.variable}`}>
      <body className="min-h-dvh bg-background text-foreground">
        <Suspense fallback={<p className="p-10 text-sm text-muted">Loading…</p>}>
          <AdminShell>{children}</AdminShell>
        </Suspense>
      </body>
    </html>
  );
}
