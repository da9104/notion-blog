import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/contexts/ThemeProvider";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import SearchBar from "@/components/SearchBar"
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

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
      <body className={geistSans.className} >
      <ThemeProvider defaultTheme="system" enableSystem disableTransitionOnChange>
        <Analytics />
          <SidebarProvider>
            <div className="w-full flex min-h-screen">
              <AppSidebar variant="sidebar" collapsible="icon" />
              <SidebarInset>
                <div className="flex flex-col min-h-screen">
                  <header className="w-full border-b md:pl-60 dark:border-[#333333] border-gray-200">
                    <div className="container mx-auto py-4 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <SidebarTrigger className="md:hidden" />
                        <Link href="/" className="font-bold text-xl">
                          DAMI UI
                        </Link>
                      </div>
                      <nav className="flex items-center gap-2 md:mr-8 mr-0">
                        <SearchBar />
                      </nav>
                    </div>
                  </header>
                  <main className="md:pl-60 pl-0 flex-1">{children}</main>
                  <footer className="w-full border-t mt-auto md:pl-60 dark:border-[#333333] border-gray-200">
                    <div className="container mx-auto py-6 text-center text-muted-foreground">
                      A blog powered by Notion as a CMS and Next.js <br/>
                      © {new Date().getFullYear()} Dami UI. All rights reserved.
                    </div>
                  </footer>
                </div>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
