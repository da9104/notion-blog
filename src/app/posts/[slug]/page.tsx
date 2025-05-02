import { notion } from "@/lib/notion"
import { databaseId } from "@/lib/notion"
import { formatDate } from "@/lib/utils"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { NotionRenderer } from "@/components/NotionRenderer"
import { PageObjectResponse, BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import Image from "next/image"

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
    const descProperty = page.properties.Content as { rich_text: Array<{ plain_text: string }> } | undefined
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

                {/* <div className="prose prose-stone dark:prose-invert max-w-none">
                    <NotionRenderer blocks={blocks as unknown as BlockObjectResponse[]} />
                </div> */}
            </article>
        </div>
    )
}

// Keep this
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic';
