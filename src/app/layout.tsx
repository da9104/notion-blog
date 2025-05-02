import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/contexts/ThemeProvider";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dami's Blog",
  description: "Dami's Blog",
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
          <SidebarProvider>
            <div className="w-full flex min-h-screen">
              <AppSidebar variant="sidebar" collapsible="icon" />
              <SidebarInset>
                <div className="flex flex-col min-h-screen">
                  <header className="w-full border-b md:pl-60">
                    <div className="container mx-auto py-4 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <SidebarTrigger className="md:hidden" />
                        <Link href="/" className="font-bold text-xl">
                          Notion Blog
                        </Link>
                      </div>
                      <nav className="hidden md:block mr-8">
                        <ul className="flex gap-4">
                          <li>
                            <Link href="/" className="hover:underline">
                              Home
                            </Link>
                          </li>
                          <li>
                            <Link href="/about" className="hover:underline">
                              About
                            </Link>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </header>
                  <main className="md:pl-60 pl-0 flex-1">{children}</main>
                  <footer className="w-full border-t mt-auto md:pl-60">
                    <div className="container mx-auto py-6 text-center text-muted-foreground">
                      © {new Date().getFullYear()} Notion Blog. All rights reserved.
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
