import { PageLayout } from "@/components/layout/page-layout"
import { notionFetch } from "@/lib/notion";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { HomeSidebar } from "@/components/layout/Sidebar/home-sidebar";
import type { PageObjectResponse, ImageBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";

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
          {posts.map((post, index) => {
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

            if (index === 0) {
              return (
                <div key={post.id} className={cn('min-h-fold flex flex-col relative col-span-2')}>
                  <Link href={`/posts/${slug}`} className="size-full flex-1 flex flex-col" prefetch>
                    <Image
                      src={finalImageUrl || '/images/pavlo-talpa-zmv-_r6hbe8-unsplash.jpg'}
                      alt={title}
                      width={1000}
                      height={100}
                      quality={100}
                      unoptimized
                      loading="lazy"
                      className="object-cover size-full flex-1"
                    />
                  </Link>
                  <div className="absolute bottom-0 left-0 grid w-full grid-cols-4 gap-6 pointer-events-none max-md:contents p-sides">
                    <div
                      className={cn(
                        'flex flex-col justify-end self-end gap-y-3 p-4 w-full bg-white md:w-96 md:rounded-md',
                      )}
                    >
                      <div className="col-span-2">
                        <Badge className="font-black capitalize rounded-full text-black dark:text-black">POST</Badge>
                      </div>
                      <Link href={`/posts/${slug}`} className="col-span-1 self-start text-2xl font-semibold text-black dark:text-black">
                        {title}
                      </Link>
                      <div className="col-span-1 mb-10">
                        {/* {post.tags.length > 0 ? ( */}
                        {/* <p className="mb-3 text-sm italic font-medium">post.tags.join('. ')</p>
                        ) : null}
                        <p className="text-sm font-medium line-clamp-3">{post.description}</p> */}
                      </div>
                      <div className="flex col-span-1 gap-3 items-center text-2xl font-semibold md:self-end">
                        {/* ${Number(product.priceRange.minVariantPrice.amount)} */}
                        {/* post.compareAtPrice && ( */}
                        {/* <span className="line-through opacity-30">${Number(product.compareAtPrice.amount)}</span>
                        )} */}
                      </div>
                      <Suspense
                      // fallback={<AddToCartButton className="flex gap-20 justify-between pr-2" size="lg" product={product} />}
                      >
                        {/* <AddToCart className="flex gap-20 justify-between pr-2" size="lg" product={product} /> */}
                      </Suspense>
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <div key={post.id} className="" >
                <Link href={`/posts/${slug}`}>
                  <Card className="h-[300px] bg-white flex flex-col border-none shadow-none">
                    {finalImageUrl && (
                      <div className="w-full h-full relative bg-gray-100 flex items-center justify-center text-sm text-gray-500 rounded-none overflow-hidden">
                        <Image
                          src={finalImageUrl}
                          alt={title}
                          fill
                          className="object-cover"
                          unoptimized
                          loading="lazy"
                        />
                      </div>
                    )}
                    <h1 className="text-lg font-bold truncate p-2 text-black dark:text-black">{title}</h1>
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
