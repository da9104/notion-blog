import { notion } from "@/lib/notion"
import { databaseId } from "@/lib/notion"
import { notFound } from "next/navigation"
import { NotionRenderer } from "@/components/notion-renderer"
import { PageObjectResponse, BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

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

    const titleProperty = page.properties.Title as { title: Array<{ plain_text: string }> }
    const dateProperty = page.properties.PublishedDate as { date: { start: string } | null }
    const tagsProperty = page.properties.Tags as { multi_select: Array<{ id: string; name: string }> }
    const fileProperty = page.properties.File as unknown as {
        type: "file" | "files",
        file?: { url: string },
        files?: Array<{ type: "file" | "external", file?: { url: string }, external?: { url: string }, name: string }>
    } | undefined

    const title = titleProperty.title[0]?.plain_text || "Untitled"
    const date = dateProperty.date?.start
    const tags = tagsProperty.multi_select || []

    const imageUrl = fileProperty?.file?.url ||
        fileProperty?.files?.[0]?.file?.url ||
        fileProperty?.files?.[0]?.external?.url

    const formattedDate = date
        ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : null

    return (
        <article className="w-full pb-24 pt-[var(--top-spacing)]">
            {/* Header */}
            <header className="px-[var(--sides)] pb-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-[var(--tertiary)] text-[10px] font-semibold uppercase tracking-widest mb-8"
                    style={{ fontFamily: 'var(--font-body)' }}
                >
                    <ChevronLeft size={14} strokeWidth={2} />
                    Back
                </Link>

                {tags[0] && (
                    <p
                        className="text-[10px] font-semibold uppercase tracking-widest text-[var(--tertiary)] mb-3"
                        style={{ fontFamily: 'var(--font-body)' }}
                    >
                        {tags[0].name}
                    </p>
                )}

                <h1
                    className="text-[2.75rem] font-medium leading-[1.05] tracking-tight text-[var(--foreground)] mb-5"
                    style={{ fontFamily: 'var(--font-headline)' }}
                >
                    {title}
                </h1>

                <div className="flex flex-wrap items-center gap-2">
                    {formattedDate && (
                        <span
                            className="text-xs text-[var(--tertiary)]"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            {formattedDate}
                        </span>
                    )}
                    {tags.slice(1).map(tag => (
                        <span
                            key={tag.id}
                            className="text-[10px] font-semibold uppercase tracking-widest border border-[var(--outline-variant)] rounded-full px-2.5 py-0.5 text-[var(--tertiary)]"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            {tag.name}
                        </span>
                    ))}
                </div>
            </header>

            {/* Full-bleed cover image */}
            {imageUrl && (
                <div className="relative w-full aspect-[4/3] bg-[var(--neutral)]">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        priority
                        className="object-cover"
                        unoptimized
                    />
                </div>
            )}

            {/* Notion body */}
            <div className="px-[var(--sides)] py-8">
                <NotionRenderer blocks={blocks as unknown as BlockObjectResponse[]} />
            </div>
        </article>
    )
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic';
