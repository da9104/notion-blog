import { NextRequest, NextResponse } from 'next/server';
import { notion } from "@/lib/notion";
import { databaseId } from "@/lib/notion";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    if (!query.trim()) {
      return NextResponse.json({ results: [] });
    }

    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: "Published",
            checkbox: {
              equals: true,
            },
          },
          {
            property: "Title",
            title: {
              contains: query,
            },
          }
        ]
      },
      sorts: [
        {
          property: "PublishedDate",
          direction: "descending",
        },
      ],
    });

    return NextResponse.json({ results: response.results });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'An error occurred during search' }, { status: 500 });
  }
} 