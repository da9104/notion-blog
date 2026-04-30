import { Client } from "@notionhq/client"
import type { BlockObjectResponse, QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints"
import fs from "fs";
import path from "path";
import sharp from "sharp";

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

const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

export function clearCache() {
    cache = { data: null, blocks: null, lastFetched: 0 };
}

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

        // Process images — download once, convert to WebP, serve from disk
        const notionImagesDir = path.join(process.cwd(), 'public', 'notion-images');
        if (!fs.existsSync(notionImagesDir)) {
            fs.mkdirSync(notionImagesDir, { recursive: true });
        }

        for (const block of allBlocks) {
            if (block.type === 'image' && block.image.type === 'file' && block.image.file.url) {
                const imageName = `${block.id}.webp`;
                const imagePath = path.join(notionImagesDir, imageName);

                try {
                    if (!fs.existsSync(imagePath)) {
                        // New image — fetch from S3, convert to WebP, save to disk
                        const imgResponse = await fetch(block.image.file.url);
                        if (!imgResponse.ok) {
                            throw new Error(`Failed to fetch image: ${imgResponse.statusText}`);
                        }
                        const arrayBuffer = await imgResponse.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);
                        await sharp(buffer).webp({ quality: 80 }).toFile(imagePath);
                    }

                    // Always point to local WebP copy
                    (block.image.file as any).url = `/notion-images/${imageName}`;
                } catch (error) {
                    console.error(`Error processing image for block ${block.id}:`, error);
                }
            }
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
