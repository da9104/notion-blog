import { Client } from "@notionhq/client"
import type { BlockObjectResponse, QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints"
import fs from "fs";
import path from "path";

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

let cache = {
    data: null as any,
    blocks: null as any,
    lastFetched: 0,
};

const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function notionFetch<T = QueryDatabaseResponse['results']>({
    query,
    variables = {},
  }: {
    query?: string;
    variables?: Record<string, any>;
  }): Promise<{ data: T; blocks: BlockWithPostId[]; errors?: any[] }> {
    
    const now = Date.now();
    if (cache.data && (now - cache.lastFetched < CACHE_TTL)) {
        console.log("Serving from cache");
        return { data: cache.data as T, blocks: cache.blocks as BlockWithPostId[] };
    }

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

        // Process images
        for (const block of allBlocks) {
            if (block.type === 'image' && block.image.type === 'file' && block.image.file.url) {
                try {
                    const imageUrl = block.image.file.url;
                    const imgResponse = await fetch(imageUrl);
                    if (!imgResponse.ok) {
                        throw new Error(`Failed to fetch image: ${imgResponse.statusText}`);
                    }
                    const arrayBuffer = await imgResponse.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    
                    const imageName = `${block.id}.jpg`;
                    const imagePath = path.join(process.cwd(), 'public', 'notion-images', imageName);

                    // Ensure directory exists
                    const dir = path.dirname(imagePath);
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }

                    fs.writeFileSync(imagePath, buffer);

                    // Replace the URL
                    (block.image.file as any).url = `/notion-images/${imageName}`;
                } catch (error) {
                    console.error(`Error processing image for block ${block.id}:`, error);
                }
            }
        }
      
             
    if (!response.results.length) {
           throw new Error(`Notion API HTTP error! Status: ${response.results}`);
     }
          
    cache = {
        data: response.results,
        blocks: allBlocks,
        lastFetched: now,
    };

    return { data: response.results as T, blocks: allBlocks };
      
    } catch (error) {
      console.error('fetch error:', error);
      throw error;
    }
  }