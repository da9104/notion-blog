import MainPageWrapper from "@/components/MainPageWrapper"
import { PageLayout } from "@/components/layout/page-layout"
import { notionFetch, notion } from "@/lib/notion";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { HomeSidebar } from "@/components/layout/Sidebar/home-sidebar";
import type { BlockObjectResponse, PageObjectResponse, QueryDatabaseResponse, ImageBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export default async function Home() {
  const { data, blocks } = await notionFetch({})

  const posts = (data ?? []).filter(
    (p): p is PageObjectResponse => "properties" in p
  );


  return (
    <PageLayout>
      <div className="contents md:grid md:grid-cols-12 md:gap-sides">
        <HomeSidebar />
        <div className="flex relative flex-col grid-cols-2 col-span-8 w-full md:grid">
          <div className="fixed top-0 left-0 z-10 w-full pointer-events-none base-grid py-sides">
            <div className="col-span-8 col-start-5">
              <div className="hidden px-6 lg:block">
                {/* <Badge variant="outline-secondary">latest drop</Badge> */}
              </div>
            </div>
          </div>
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
      </div>
    </PageLayout>
  )
}
