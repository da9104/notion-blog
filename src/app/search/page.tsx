import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import Image from "next/image"
import Link from "next/link"

async function getSearchResults(query: string) {
  if (!query) return []

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/search?q=${encodeURIComponent(query)}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }

    const data = await response.json();
    return data.results as PageObjectResponse[];
  } catch (error) {
    console.error('Error fetching search results:', error);
    return [];
  }
}

type SearchPageProps = {
  params?: { slug?: string },
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = typeof searchParams.q === 'string' ? searchParams.q : ""
  const posts = await getSearchResults(query)

  return (
    <div className="relative md:max-w-screen-xl w-full mx-auto py-10">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Search Results for "{query}"</h1>
        <p className="text-xl text-muted-foreground">{posts.length} result(s) found</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl">No posts found matching your search query.</p>
          <Link href="/" className="text-primary hover:underline mt-4 inline-block">
            Return to home
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            // Type assertions for Notion properties
            const titleProperty = post.properties.Title as { title: Array<{ plain_text: string }> }
            const slugProperty = post.properties.Slug as { rich_text: Array<{ plain_text: string }> }
            const dateProperty = post.properties.PublishedDate as { date: { start: string } | null }
            const tagsProperty = post.properties.Tags as { multi_select: Array<{ id: string; name: string }> }
            const descProperty = post.properties.Content as { rich_text: Array<{ plain_text: string }> } | undefined
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
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
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
          })}
        </div>
      )}
    </div>
  )
} 