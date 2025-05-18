import { NextRequest, NextResponse } from "next/server"
import { notion } from "@/lib/notion"
import { databaseId } from "@/lib/notion"

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
    })
  
    return NextResponse.json(response.results)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}
  