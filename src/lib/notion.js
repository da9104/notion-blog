import { Client } from "@notionhq/client"

// Check for required environment variables
if (!process.env.NOTION_API_KEY) {
  throw new Error("Missing required environment variable: NOTION_API_KEY")
}

if (!process.env.NOTION_DATABASE_ID) {
  throw new Error("Missing required environment variable: NOTION_DATABASE_ID")
}

// Initialize the Notion client
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

// Export database ID for reuse
export const databaseId = process.env.NOTION_DATABASE_ID 