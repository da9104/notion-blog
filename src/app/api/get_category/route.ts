import { NextRequest, NextResponse } from "next/server"
import { notion } from "@/lib/notion"
import { databaseId } from "@/lib/notion"
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"

// Function to get categories from posts
export async function GET(request: NextRequest) {
    try {
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

    return NextResponse.json(categories)
    } catch (error) {
        console.error("Error fetching categories:", error)
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
    }
}
