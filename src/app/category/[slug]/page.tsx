import { notion } from "@/lib/notion"
import { databaseId } from "@/lib/notion"
import { formatDate } from "@/lib/utils"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { NotionRenderer } from "@/components/notion-renderer"
import { PageObjectResponse, BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

async function getPostBySlug(slug: string) {
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            filter: {
                and: [
                    {
                        property: "Slug",
                        rich_text: {
                            equals: slug,
                        },
                    },
                    {
                        property: "Published",
                        checkbox: {
                            equals: true,
                        },
                    },
                ],
            },
        })
    
        if (!response.results.length) {
            return null
        }
    
        const page = response.results[0]
        const blocks = await notion.blocks.children.list({
            block_id: page.id,
        })
        return {
            page: page as PageObjectResponse,
            blocks: blocks.results,
        }
    } catch (error) {
        console.error("Error fetching post:", error)
        notFound()
    }
}

async function getPostsByCategory(category: string) {
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            filter: {
                and: [
                    {
                        property: "Tags",
                        multi_select: {
                            contains: category,
                        },
                    },
                    {
                        property: "Published",
                        checkbox: {
                            equals: true,
                        },
                    },
                ],
            },
            sorts: [
                {
                    property: "PublishedDate",
                    direction: "descending",
                },
            ],
        })
        
        return response.results as PageObjectResponse[]
    } catch (error) {
        console.error("Error fetching posts by category:", error)
        return []
    }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const post = await getPostBySlug(resolvedParams.slug);
    

    if (!post) {
        notFound();
    }

    const { page, blocks } = post

    // Add type assertions for Notion properties
    const titleProperty = page.properties.Title as { title: Array<{ plain_text: string }> }
    const dateProperty = page.properties.PublishedDate as { date: { start: string } | null }
    const tagsProperty = page.properties.Tags as { multi_select: Array<{ id: string; name: string }> }
    const descProperty = page.properties.Description as { rich_text: Array<{ plain_text: string }> } | undefined
    const fileProperty = page.properties.File as unknown as { 
        type: "file" | "files", 
        file?: { url: string }, 
        files?: Array<{ type: "file" | "external", file?: { url: string }, external?: { url: string }, name: string }> 
    } | undefined

    const title = titleProperty.title[0]?.plain_text || "Untitled"
    const date = dateProperty.date?.start
    const tags = tagsProperty.multi_select || []
    
    // Get URL from either file or files property format
    const imageUrl = fileProperty?.file?.url || 
                     fileProperty?.files?.[0]?.file?.url || 
                     fileProperty?.files?.[0]?.external?.url

    const sameCategory = tags.some((tag) => tag.name === resolvedParams.slug)

    if (sameCategory) {
        // Fetch all posts with the same category
        const categoryPosts = await getPostsByCategory(resolvedParams.slug)
        
        return (
            <div className="container mx-auto py-10">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Category: {resolvedParams.slug}</h1>
                    <p className="text-xl text-muted-foreground mb-8">Browse all posts in this category</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryPosts.map((post) => {
                        // Type assertions for Notion properties
                        const postTitleProperty = post.properties.Title as { title: Array<{ plain_text: string }> }
                        const slugProperty = post.properties.Slug as { rich_text: Array<{ plain_text: string }> }
                        const postDateProperty = post.properties.PublishedDate as { date: { start: string } | null }
                        const postTagsProperty = post.properties.Tags as { multi_select: Array<{ id: string; name: string }> }
                        const postDescProperty = post.properties.Description as { rich_text: Array<{ plain_text: string }> } | undefined
                        const postFileProperty = post.properties.File as unknown as { 
                            type: "file" | "files", 
                            file?: { url: string }, 
                            files?: Array<{ type: "file" | "external", file?: { url: string }, external?: { url: string }, name: string }> 
                        } | undefined

                        const postTitle = postTitleProperty.title[0]?.plain_text || "Untitled"
                        const postSlug = slugProperty.rich_text[0]?.plain_text || post.id
                        const postDate = postDateProperty.date?.start
                        const postTags = postTagsProperty.multi_select || []
                        
                        // Get URL from either file or files property format
                        const postImageUrl = postFileProperty?.file?.url || 
                                        postFileProperty?.files?.[0]?.file?.url || 
                                        postFileProperty?.files?.[0]?.external?.url
                        
                        return (
                            <Card key={post.id} className="overflow-hidden flex flex-col h-full border border-gray-200 dark:border-[#333333]">
                                <Link href={`/posts/${postSlug}`}>
                                    {postImageUrl && (
                                        <div className="relative w-full h-48">
                                            <Image 
                                                src={postImageUrl} 
                                                alt={postTitle} 
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <CardHeader>
                                        <CardTitle>{postTitle}</CardTitle>
                                        {postDate && <CardDescription>{formatDate(postDate)}</CardDescription>}
                                    </CardHeader>
                                </Link>
                                <CardContent className="flex-grow">
                                    {postDescProperty?.rich_text[0]?.plain_text && (
                                        <p className="text-muted-foreground line-clamp-2">{postDescProperty.rich_text[0].plain_text}</p>
                                    )}
                                </CardContent>
                                <CardFooter>
                                    {postTags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {postTags.map((tag: { id: string; name: string }) => (
                                                <Badge key={tag.id} variant="secondary">
                                                    {tag.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10">
            <article className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">{title}</h1>
                    {date && <div className="text-muted-foreground mb-4">{formatDate(date)}</div>}
                    {descProperty?.rich_text[0]?.plain_text && (
                        <div className="text-muted-foreground mb-4">{descProperty.rich_text[0].plain_text}</div>
                    )}
                    {imageUrl && (
                        <Image 
                            src={imageUrl} 
                            alt={title} 
                            width={800} 
                            height={400} 
                            className="w-full max-h-96 object-cover mb-6 rounded-lg" 
                        />
                    )}
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag: { id: string; name: string }) => (
                                <Badge key={tag.id} variant="secondary">
                                    {tag.name}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                <div className="prose prose-stone dark:prose-invert max-w-none">
                    <NotionRenderer blocks={blocks as unknown as BlockObjectResponse[]} />
                </div>
            </article>
        </div>
    )
}

// Keep this
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic';
