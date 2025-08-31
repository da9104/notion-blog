import MainPageWrapper from "@/components/MainPageWrapper"
import { PageLayout } from "@/components/layout/page-layout"
import { notionFetch, notion } from "@/lib/notion";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { BlockObjectResponse, PageObjectResponse, QueryDatabaseResponse, ImageBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export default async function Home() {
  const { data, blocks } = await notionFetch({})

  const posts = (data ?? []).filter(
    (p): p is PageObjectResponse => "properties" in p
  );


  return (
    <PageLayout>
      <div>
        {posts.map((post) => {
          const titleProperty = post.properties.Title as { title: Array<{ plain_text: string }> }
          const title = titleProperty.title[0]?.plain_text || "Untitled"

          // Try to extract image URL from File property first (preferred method)
          const fileProperty = post.properties.File as unknown as {
            type: "file" | "files",
            file?: { url: string },
            files?: Array<{ type: "file" | "external", file?: { url: string }, external?: { url: string }, name: string }>
          } | undefined
          
          const slugProperty = post.properties.Slug
          const slug =
          slugProperty?.type === 'rich_text'
          ? slugProperty.rich_text[0]?.plain_text || post.id
          : slugProperty?.type === 'title'
          ? slugProperty.title[0]?.plain_text || post.id
          : post.id;

          
           const cover = post.cover;
           const coverUrl = cover
           ? cover.type === 'external' 
           ? cover.external.url 
           : cover.file.url
           : undefined;

           const imageBlock = (blocks as any[])?.find(
            (b: any) => b.type === 'image' && b?.postId === post.id
           ) as ImageBlockObjectResponse | undefined;
           

           const fromBlock = imageBlock
           ? (imageBlock.image.type === 'external'
            ? imageBlock.image.external.url
            : imageBlock.image.file.url
           ) : undefined;
    
    
            const finalImageUrl = 
              fromBlock ||
              fileProperty?.file?.url ||
              fileProperty?.files?.[0]?.file?.url ||
              fileProperty?.files?.[0]?.external?.url ||
              coverUrl
    
            return (
            <div key={post.id} >
                <Link href={`/posts/${slug}`}>
                  <Card className="h-[200px] bg-white p-2 flex flex-col">
                    {finalImageUrl && (
                      <div className="w-full h-full relative bg-gray-100 flex items-center justify-center text-sm text-gray-500 rounded-md overflow-hidden">
                        <Image
                          src={finalImageUrl}
                          alt={title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <h1 className="text-lg font-bold truncate p-2">{title}</h1>
                  </Card>
                </Link>
            </div>
            )
        })}
      </div>
    </PageLayout>
  )
}
