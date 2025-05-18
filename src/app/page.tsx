'use client'
import Link from "next/link"
import { notion } from "@/lib/notion"
import { databaseId } from "@/lib/notion"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  const [posts, setPosts] = useState<PageObjectResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/get_posts`)
        const data = await fetchedPosts.json()
        setPosts(data)
        console.log("Posts data:", JSON.stringify(data[0]?.properties?.File || {}, null, 2))
      } catch (error) {
      console.error("Error fetching posts:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPosts()
  }, [])

  return (
    <div className="relative md:max-w-screen-xl w-full mx-auto py-10">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-xl font-bold tracking-tight sm:text-xl mb-4">Dami UI Blog</h1>
        <p className="text-xl text-muted-foreground">A collection of articles, tutorials, and design system resources for Front End Solution</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Skeleton className="w-150 h-150" />
            <Skeleton className="w-150 h-150" />
            <Skeleton className="w-150 h-150" />
          </div>
        ) : (
          posts.map((post) => {
            // Type assertions for Notion properties
          const titleProperty = post.properties.Title as { title: Array<{ plain_text: string }> }
          const slugProperty = post.properties.Slug as { rich_text: Array<{ plain_text: string }> }
          const dateProperty = post.properties.PublishedDate as { date: { start: string } | null }
          const tagsProperty = post.properties.Tags as { multi_select: Array<{ id: string; name: string }> }
          const descProperty = post.properties.Description as { rich_text: Array<{ plain_text: string }> } | undefined
          const fileProperty = post.properties.File as unknown as {
            type: "file" | "files",
            file?: { url: string },
            files?: Array<{ type: "file" | "external", file?: { url: string }, external?: { url: string }, name: string }>
          } | undefined

          const title = titleProperty.title[0]?.plain_text || "Untitled"
          const slug = slugProperty.rich_text[0]?.plain_text || post.id
          const date = dateProperty.date?.start
          const tags = tagsProperty.multi_select || []

          // Get URL from either file or files property format
          const imageUrl = fileProperty?.file?.url ||
            fileProperty?.files?.[0]?.file?.url ||
            fileProperty?.files?.[0]?.external?.url

          return (
            <Link href={`/posts/${slug}`} key={post.id}>
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow border border-gray-200 dark:border-[#333333]">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{title}</CardTitle>
                  {date && <CardDescription>{formatDate(date)}</CardDescription>}
                </CardHeader>
                <CardContent>
                  <div className="line-clamp-3 text-muted-foreground">
                    {descProperty?.rich_text[0]?.plain_text || "No description available"}
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt={title}
                        width={400}
                        height={300}
                        className="w-full h-40 object-cover mt-2"
                      />
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag: { id: string; name: string }) => (
                      <Badge key={tag.id} variant="secondary">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          )
          })
        )}
      </div>
    </div>
  )
}
