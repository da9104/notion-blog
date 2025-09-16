'use client'
import type * as React from "react"
import Link from "next/link"
import { Tag, Clock, BookOpen, Home } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { useState, useEffect } from "react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [categories, setCategories] = useState<any[]>([])
    const [recentPosts, setRecentPosts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/get_category`)
        const data = await fetchedCategories.json()
        setCategories(data)
        setRecentPosts(data)
        console.log("Posts data:", JSON.stringify(data[0]?.properties?.File || {}, null, 2))
      } catch (error) {
      console.error("Error fetching posts:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    setIsLoading(true)
    const fetchRecentPosts = async () => {
      try {
        const recentPosts = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/get_recent_post`)
        const data = await recentPosts.json()
        setRecentPosts(data)
      } catch (error) {
        console.error("Error fetching recent posts:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRecentPosts()
  }, [])

    return (
        <Sidebar {...props} className="border-r dark:border-[#333333] border-gray-200">
            <SidebarContent className="bg-white dark:bg-[#171717] w-[220px] ">
                <SidebarHeader>
                    <p className="text-2xl font-bold md:hidden block">Dami UI</p>
                </SidebarHeader>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/">
                                        <Home className="size-4" />
                                        <span>Home</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/about">
                                        <BookOpen className="size-4" />
                                        <span>About</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Categories</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {categories && categories.map((category: any) => (
                                <SidebarMenuItem key={category.id}>
                                    <SidebarMenuButton asChild>
                                        <Link href={`/category/${category.slug}`}>
                                            <Tag className="size-4" />
                                            <span>{category.name}</span>
                                            <span className="ml-auto text-xs text-muted-foreground">{category.count}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Recent Posts</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {recentPosts && recentPosts.map((post: any) => (
                                <SidebarMenuItem key={post.id}>
                                    <SidebarMenuButton asChild>
                                        <Link href={`/posts/${post.slug}`}>
                                            <Clock className="size-4" />
                                            <span>{post.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            {/* <SidebarFooter>
                <div className="px-3 py-2 text-xs text-muted-foreground">© {new Date().getFullYear()} Notion Blog</div>
            </SidebarFooter> */}
        </Sidebar>
    )
}
