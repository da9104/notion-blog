import { NextRequest, NextResponse } from "next/server"
import { notion } from "@/lib/notion"
import { databaseId } from "@/lib/notion"

export async function GET(request: NextRequest) {
    try {
        console.log("API: Starting to fetch posts from Notion database...")
        console.log("API: Database ID:", databaseId)
        console.log("API: Notion API Key exists:", !!process.env.NEXT_PUBLIC_NOTION_API_KEY)
        
        if (!databaseId) {
            throw new Error("Database ID is not configured")
        }
        
        if (!process.env.NEXT_PUBLIC_NOTION_API_KEY) {
            throw new Error("Notion API Key is not configured")
        }
        
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
        })
        
        console.log("API: Successfully fetched", response.results.length, "posts")

        // Fetch blocks for ALL posts to get images from content
        const allBlocks = []
        for (const post of response.results) {
            try {
                const blocks = await notion.blocks.children.list({
                    block_id: post.id,
                })
                // Add post id to each block for easier matching
                const blocksWithPostId = blocks.results.map(block => ({
                    ...block,
                    postId: post.id
                }))
                allBlocks.push(...blocksWithPostId)
            } catch (error) {
                console.error(`Error fetching blocks for post ${post.id}:`, error)
            }
        }

        console.log("API: Successfully fetched blocks for all posts:", allBlocks.length)

        return NextResponse.json({
            posts: response.results,
            blocks: allBlocks
        })
    } catch (error) {
        console.error("API Error fetching posts:", error)
        return NextResponse.json({ 
            error: "Failed to fetch posts", 
            details: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString()
        }, { status: 500 })
    }
}
  