"use client"
import React from "react"
import Image from "next/image"
import Link from "next/link"
import { BlockObjectResponse, RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"

export function NotionRenderer({ blocks }: { blocks: BlockObjectResponse[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block) => {
        const { id, type } = block

        switch (type) {
          case "paragraph":
            return (
              <p
                key={id}
                className="text-base leading-relaxed text-[var(--foreground)]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {block.paragraph.rich_text.map((text: RichTextItemResponse, index: number) => (
                  <RichText key={index} text={text} />
                ))}
              </p>
            )

          case "heading_1":
            return (
              <h1
                key={id}
                className="text-3xl font-medium mt-10 mb-3 text-[var(--foreground)]"
                style={{ fontFamily: 'var(--font-headline)' }}
              >
                {block.heading_1.rich_text.map((text: RichTextItemResponse, index: number) => (
                  <RichText key={index} text={text} />
                ))}
              </h1>
            )

          case "heading_2":
            return (
              <h2
                key={id}
                className="text-2xl font-medium mt-8 mb-2 text-[var(--foreground)]"
                style={{ fontFamily: 'var(--font-headline)' }}
              >
                {block.heading_2.rich_text.map((text: RichTextItemResponse, index: number) => (
                  <RichText key={index} text={text} />
                ))}
              </h2>
            )

          case "heading_3":
            return (
              <h3
                key={id}
                className="text-xl font-medium mt-6 mb-2 text-[var(--foreground)]"
                style={{ fontFamily: 'var(--font-headline)' }}
              >
                {block.heading_3.rich_text.map((text: RichTextItemResponse, index: number) => (
                  <RichText key={index} text={text} />
                ))}
              </h3>
            )

          case "bulleted_list_item":
            return (
              <li
                key={id}
                className="text-base leading-relaxed text-[var(--foreground)] ml-4 list-disc"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {block.bulleted_list_item.rich_text.map((text: RichTextItemResponse, index: number) => (
                  <RichText key={index} text={text} />
                ))}
              </li>
            )

          case "numbered_list_item":
            return (
              <li
                key={id}
                className="text-base leading-relaxed text-[var(--foreground)] ml-4 list-decimal"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {block.numbered_list_item.rich_text.map((text: RichTextItemResponse, index: number) => (
                  <RichText key={index} text={text} />
                ))}
              </li>
            )

          case "image": {
            const imageUrl = block.image.type === "external"
              ? block.image.external.url
              : block.image.file.url
            const caption = block.image.caption?.length ? block.image.caption[0].plain_text : ""

            return (
              <figure key={id} className="my-8">
                <div className="relative w-full aspect-[4/3] bg-[var(--neutral)]">
                  <Image
                    src={imageUrl || ""}
                    alt={caption || "Article image"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                {caption && (
                  <figcaption
                    className="text-center text-xs text-[var(--tertiary)] mt-2"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {caption}
                  </figcaption>
                )}
              </figure>
            )
          }

          case "code":
            return (
              <pre
                key={id}
                className="p-4 bg-[var(--neutral)] rounded-sm overflow-x-auto"
              >
                <code
                  className="text-sm text-[var(--foreground)]"
                  style={{ fontFamily: 'monospace' }}
                >
                  {block.code.rich_text.map((text: RichTextItemResponse, index: number) => (
                    <span key={index}>{text.plain_text}</span>
                  ))}
                </code>
              </pre>
            )

          case "quote":
            return (
              <blockquote
                key={id}
                className="border-l-2 border-[var(--foreground)] pl-5 py-1 italic text-xl text-[var(--foreground)]"
                style={{ fontFamily: 'var(--font-headline)' }}
              >
                {block.quote.rich_text.map((text: RichTextItemResponse, index: number) => (
                  <RichText key={index} text={text} />
                ))}
              </blockquote>
            )

          case "divider":
            return <hr key={id} className="my-8 border-[var(--outline-variant)]" />

          default:
            return null
        }
      })}
    </div>
  )
}

function RichText({ text }: { text: RichTextItemResponse }) {
  if (!text) return null

  const content: React.ReactNode = text.plain_text || ""

  if (text.annotations.code) {
    return (
      <code className="bg-[var(--neutral)] text-[var(--foreground)] px-1.5 py-0.5 rounded-sm text-sm font-mono">
        {content}
      </code>
    )
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
      <Link
        href={text.href}
        className="text-[var(--foreground)] underline underline-offset-2 hover:text-[var(--tertiary)] transition-colors"
      >
        {content}
      </Link>
    )
  }

  return <>{content}</>
}
