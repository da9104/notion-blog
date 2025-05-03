import { Client } from "@notionhq/client"

if (!process.env.NEXT_PUBLIC_NOTION_DATABASE_ID || !process.env.NEXT_PUBLIC_NOTION_API_KEY) {
    throw new Error("Missing Notion environment variables");
}
// The ID of your Notion database
export const databaseId = process.env.NEXT_PUBLIC_NOTION_DATABASE_ID || ""

// The API key for your Notion integration
export const notionApiKey = process.env.NEXT_PUBLIC_NOTION_API_KEY || ""

// The Notion client
export const notion = new Client({ auth: notionApiKey })
