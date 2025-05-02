import { Client } from "@notionhq/client"

// The ID of your Notion database
export const databaseId = process.env.NOTION_DATABASE_ID || ""

// The API key for your Notion integration
export const notionApiKey = process.env.NOTION_API_KEY || ""

// The Notion client
export const notion = new Client({ auth: notionApiKey })
