import { Client } from "@notionhq/client"
import type { BlockObjectResponse, QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints"

if (!process.env.NEXT_PUBLIC_NOTION_DATABASE_ID || !process.env.NEXT_PUBLIC_NOTION_API_KEY) {
    throw new Error("Missing Notion environment variables");
}
// The ID of your Notion database
export const databaseId = process.env.NEXT_PUBLIC_NOTION_DATABASE_ID || ""

// The API key for your Notion integration
export const notionApiKey = process.env.NEXT_PUBLIC_NOTION_API_KEY || ""

// The Notion client
export const notion = new Client({ auth: notionApiKey })

type BlockWithPostId = BlockObjectResponse & {
  postId: string
}

export async function notionFetch<T = QueryDatabaseResponse['results']>({
    query,
    variables = {},
  }: {
    query?: string;
    variables?: Record<string, any>;
  }): Promise<{ data: T; blocks: BlockWithPostId[]; errors?: any[] }> {
    
    if (!databaseId) {
        throw new Error("Database ID is not configured")
    }
    
    if (!notionApiKey) {
        throw new Error("Notion API Key is not configured")
    }
    
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
      
         // Fetch blocks for ALL posts to get images from content
         const allBlocks: BlockWithPostId[] = []
         for (const post of response.results) {
             try {
                 const blocks = await notion.blocks.children.list({
                     block_id: post.id,
                 })
                 // Add post id to each block for easier matching
                 const blocksWithPostId = (blocks.results as BlockObjectResponse[]).map(block => ({
                     ...block,
                     postId: post.id
                 }))
                 allBlocks.push(...blocksWithPostId)
             } catch (error) {
                 console.error(`Error fetching blocks for post ${post.id}:`, error)
             }
         }
 
         console.log("API: Successfully fetched blocks for all posts:", allBlocks.length)
      
             
    if (!response.results.length) {
           throw new Error(`Notion API HTTP error! Status: ${response.results}`);
     }
          
    return { data: response.results as T, blocks: allBlocks };
      
    } catch (error) {
      console.error('Shopify fetch error:', error);
      throw error;
    }
  }
  