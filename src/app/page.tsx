'use client'

import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { useEffect, useState } from "react"
import MainPageWrapper from "@/components/MainPageWrapper"

export default function Home() {
  const [posts, setPosts] = useState<PageObjectResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/get_post`)
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
    <MainPageWrapper />
  )
}
