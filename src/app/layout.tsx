import type { Metadata } from "next";
import { Newsreader, Manrope, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/contexts/ThemeProvider";
import { LocaleProvider } from "@/contexts/LocaleProvider";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header/Header";
import BottomNav from "@/components/layout/BottomNav";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";

const newsreader = Newsreader({
  variable: "--font-headline",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-ko",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "©DAMI UI — Design Blog",
  description: "Design, code and craft by Dami K.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          newsreader.variable,
          manrope.variable,
          notoSansKR.variable,
          "antialiased min-h-screen font-[family-name:var(--font-body)] bg-[var(--desktop-mat)]"
        )}
      >
        <LocaleProvider>
        <ThemeProvider defaultTheme="system" enableSystem disableTransitionOnChange>
          <Analytics />
          {/* Desktop-only fixed left branding panel */}
          <DesktopSidebar />

          {/* Offset wrapper — pushes phone frame right of sidebar on desktop */}
          <div className="lg:pl-[280px]">
            {/* Phone-frame shell — max 430px, centered on all screen sizes */}
            <div className="relative mx-auto w-full max-w-[430px] min-h-screen bg-[var(--background)] shadow-[0_0_60px_rgba(0,0,0,0.12)]">
              <main data-vaul-drawer-wrapper="true">
                <Header />
                {children}
              </main>
              <BottomNav />
            </div>
          </div>
        </ThemeProvider>
        </LocaleProvider>
        <Toaster />
      </body>
    </html>
  );
}
