import { SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link";
import SearchBar from "@/components/search-bar";
import { Toaster } from "@/components/ui/toaster";

const BlogLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
          <SidebarProvider>
            <div className="w-full flex min-h-screen">
              <AppSidebar variant="sidebar" collapsible="icon" />
              <SidebarInset>
                <div className="flex flex-col min-h-screen">
                  <header className="w-full border-b md:pl-60 dark:border-[#333333] border-gray-200 bg-white dark:bg-black text-black dark:text-white">
                    <div className="w-full mx-auto py-4 grid grid-cols-12 items-center">
                      <div className="col-span-9 flex items-center gap-2 shrink-0">
                        <SidebarTrigger className="md:hidden" />
                        <Link href="/" className="font-bold text-xl">
                          DAMI UI
                        </Link>
                      </div>
                      <nav className="col-span-3 flex justify-end items-center flex-shrink md:mr-8">
                        <SearchBar />
                      </nav>
                    </div>
                  </header>
                  <main className="md:pl-60 pl-0 flex-1 bg-white dark:bg-black">{children}</main>
                  <footer className="w-full border-t mt-auto md:pl-60 dark:border-[#333333] border-gray-200 bg-white dark:bg-black text-black dark:text-white">
                    <div className="container mx-auto py-6 text-center text-muted-foreground ">
                      A blog powered by Notion as a CMS and Next.js <br/>
                      © {new Date().getFullYear()} Dami UI. All rights reserved.
                    </div>
                  </footer>
                </div>
              </SidebarInset>
            </div>
          </SidebarProvider>
          <Toaster />
        </>
    )
}

export default BlogLayout;