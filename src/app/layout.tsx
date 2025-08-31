import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css";
import ThemeProvider from "@/contexts/ThemeProvider";
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Dami UI Design System Blog",
  description: "Dami UI Design System Blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body className={cn(geistSans.variable, geistMono.variable, "antialiased min-h-screen",)}>
        <ThemeProvider defaultTheme="system" enableSystem disableTransitionOnChange>
          <Analytics />
          <main data-vaul-drawer-wrapper="true">
            <Header />
            {children}
          </main>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
