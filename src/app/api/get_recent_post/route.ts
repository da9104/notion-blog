import { databaseId } from "@/lib/notion"
import { notion } from "@/lib/notion"
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { NextRequest, NextResponse } from "next/server"

// Function to get recent posts
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
        sorts: [
            {
                property: "PublishedDate",
                direction: "descending",
            },
        ],
        page_size: 5,
    })

    const posts = response.results as PageObjectResponse[]

    return NextResponse.json(posts.map((post) => {
        const titleProperty = post.properties.Title as { title: Array<{ plain_text: string }> }
        const slugProperty = post.properties.Slug as { rich_text: Array<{ plain_text: string }> }

        return {
            title: titleProperty.title[0]?.plain_text || "Untitled",
            slug: slugProperty.rich_text[0]?.plain_text || post.id,
        }
    }))
    } catch (error) {
        console.error("Error fetching recent posts:", error)
        return NextResponse.json({ error: "Failed to fetch recent posts" }, { status: 500 })
    }
}
