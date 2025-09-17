"use client"
import React from "react"
import Image from "next/image"
import Link from "next/link"
import { BlockObjectResponse, RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"

export function NotionRenderer({ blocks }: { blocks: BlockObjectResponse[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block) => {
        const { id, type } = block

        switch (type) {
          case "paragraph":
            return (
              <p key={id} className='text-black dark:text-white'>
                {block.paragraph.rich_text.map((text: RichTextItemResponse, index: number) => (
                  <RichText key={index} text={text} />
                ))}
              </p>
            )

          case "heading_1":
            return (
              <h1 key={id} className="text-3xl font-bold mt-8 mb-4 text-black dark:text-white">
                {block.heading_1.rich_text.map((text: RichTextItemResponse, index: number) => (
                  <RichText key={index} text={text} />
                ))}
              </h1>
            )

          case "heading_2":
            return (
              <h2 key={id} className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">
                {block.heading_2.rich_text.map((text: RichTextItemResponse, index: number) => (
                  <RichText key={index} text={text} />
                ))}
              </h2>
            )

          case "heading_3":
            return (
              <h3 key={id} className="text-xl font-bold mt-6 mb-4 text-black dark:text-white">
                {block.heading_3.rich_text.map((text: RichTextItemResponse, index: number) => (
                  <RichText key={index} text={text} />
                ))}
              </h3>
            )

          case "bulleted_list_item":
            return (
              <li key={id}>
                {block.bulleted_list_item.rich_text.map((text: RichTextItemResponse, index: number) => (
                  <RichText key={index} text={text} />
                ))}
              </li>
            )

          case "numbered_list_item":
            return (
              <li key={id}>
                {block.numbered_list_item.rich_text.map((text: RichTextItemResponse, index: number) => (
                  <RichText key={index} text={text} />
                ))}
              </li>
            )

          case "image":
            const imageUrl = block.image.type === "external" 
              ? block.image.external.url 
              : block.image.file.url
            const caption = block.image.caption?.length ? block.image.caption[0].plain_text : ""

            return (
              <figure key={id} className="my-8">
                <div className="relative h-96 w-full">
                  <Image
                    src={imageUrl || ""}
                    alt={caption || "Blog image"}
                    fill
                    className="object-contain"
                  />
                </div>
                {caption && (
                  <figcaption className="text-center text-sm text-muted-foreground mt-2 text-black dark:text-white">{caption}</figcaption>
                )}
              </figure>
            )

          case "code":
            return (
              <pre key={id} className="p-4 bg-muted rounded-md overflow-x-auto">
                <code>
                  {block.code.rich_text.map((text: RichTextItemResponse, index: number) => (
                    <span key={index}>{text.plain_text}</span>
                  ))}
                </code>
              </pre>
            )

          case "quote":
            return (
              <blockquote key={id} className="border-l-4 pl-4 italic">
                {block.quote.rich_text.map((text: RichTextItemResponse, index: number) => (
                  <RichText key={index} text={text} />
                ))}
              </blockquote>
            )

          case "divider":
            return <hr key={id} className="my-8 text-black dark:text-white" />

          default:
            return (
              <div key={id} className="text-gray-900 dark:text-white">
                Unsupported block type: {type}
              </div>
            )
        }
      })}
    </div>
  )
}

function RichText({ text }: { text: RichTextItemResponse }) {
  if (!text) return null

  const content: React.ReactNode = text.plain_text || ""

  if (text.annotations.code) {
    return <code className="bg-muted px-1 py-0.5 rounded">{content}</code>
  }

  if (text.annotations.underline) {
    return <u>{content}</u>
  }

  if (text.annotations.strikethrough) {
    return <s>{content}</s>
  }

  if (text.annotations.italic) {
    return <em>{content}</em>
  }

  if (text.annotations.bold) {
    return <strong>{content}</strong>
  }

  if (text.href) {
    return (
      <Link href={text.href} className="text-primary underline text-black dark:text-white">
        {content}
      </Link>
    )
  }

  return <>{content}</>
}
