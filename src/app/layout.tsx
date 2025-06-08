import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/contexts/ThemeProvider";
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "@/components/ui/toaster"

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
      <body className="" >
      <ThemeProvider defaultTheme="system" enableSystem disableTransitionOnChange>
        <Analytics />
        {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
