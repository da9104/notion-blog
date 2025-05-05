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
import { notion } from "@/lib/notion"
import { databaseId } from "@/lib/notion"
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"

// Function to get categories from posts
async function getCategories() {
    const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
            property: "Published",
            checkbox: {
                equals: true,
            },
        },
    })

    const posts = response.results as PageObjectResponse[]

    // Extract all tags from posts
    const allTags: { id: string; name: string; slug: string }[] = []
    posts.forEach((post) => {
        const tagsProperty = post.properties.Tags as { multi_select: Array<{ id: string; name: string }> }
        const slugProperty = post.properties.Slug as { rich_text: Array<{ plain_text: string }> }

        const tags = tagsProperty.multi_select || []
        tags.forEach((tag) => {
            if (!allTags.some((t) => t.id === tag.id)) {
                allTags.push({ id: tag.id, name: tag.name, slug: slugProperty.rich_text[0]?.plain_text || post.id })
            }
        })
    })

    // Count posts per tag
    const categories = allTags.map((tag) => {
        const count = posts.filter((post) => {
            const tagsProperty = post.properties.Tags as { multi_select: Array<{ id: string; name: string }> }
            return tagsProperty.multi_select.some((t) => t.id === tag.id)
        }).length

        return {
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            count,
        }
    })

    return categories
}

// Function to get recent posts
async function getRecentPosts() {
    const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
            property: "Published",
            checkbox: {
                equals: true,
            },
        },
        sorts: [
            {
                property: "PublishedDate",
                direction: "descending",
            },
        ],
        page_size: 5,
    })

    const posts = response.results as PageObjectResponse[]

    return posts.map((post) => {
        const titleProperty = post.properties.Title as { title: Array<{ plain_text: string }> }
        const slugProperty = post.properties.Slug as { rich_text: Array<{ plain_text: string }> }

        return {
            title: titleProperty.title[0]?.plain_text || "Untitled",
            slug: slugProperty.rich_text[0]?.plain_text || post.id,
        }
    })
}

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const categories = await getCategories()
    const recentPosts = await getRecentPosts()

    return (
        <Sidebar {...props}>
            <SidebarContent className="bg-white w-[220px]">
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
                            {categories.map((category) => (
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
                            {recentPosts.map((post) => (
                                <SidebarMenuItem key={post.slug}>
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
