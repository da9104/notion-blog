"use client"
import Image from "next/image"
import Link from "next/link"

export function NotionRenderer({ blocks }: { blocks: any[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block) => {
        const { id, type } = block

        switch (type) {
          case "paragraph":
            return (
              <p key={id}>
                {block.paragraph.rich_text.map((text: any, index: number) => (
                  <RichText key={index} text={text} />
                ))}
              </p>
            )

          case "heading_1":
            return (
              <h1 key={id} className="text-3xl font-bold mt-8 mb-4">
                {block.heading_1.rich_text.map((text: any, index: number) => (
                  <RichText key={index} text={text} />
                ))}
              </h1>
            )

          case "heading_2":
            return (
              <h2 key={id} className="text-2xl font-bold mt-8 mb-4">
                {block.heading_2.rich_text.map((text: any, index: number) => (
                  <RichText key={index} text={text} />
                ))}
              </h2>
            )

          case "heading_3":
            return (
              <h3 key={id} className="text-xl font-bold mt-6 mb-4">
                {block.heading_3.rich_text.map((text: any, index: number) => (
                  <RichText key={index} text={text} />
                ))}
              </h3>
            )

          case "bulleted_list_item":
            return (
              <li key={id}>
                {block.bulleted_list_item.rich_text.map((text: any, index: number) => (
                  <RichText key={index} text={text} />
                ))}
              </li>
            )

          case "numbered_list_item":
            return (
              <li key={id}>
                {block.numbered_list_item.rich_text.map((text: any, index: number) => (
                  <RichText key={index} text={text} />
                ))}
              </li>
            )

          case "image":
            const imageUrl = block.image.file?.url || block.image.external?.url
            const caption = block.image.caption?.length ? block.image.caption[0].plain_text : ""

            return (
              <figure key={id} className="my-8">
                <div className="relative h-96 w-full">
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt={caption || "Blog image"}
                    fill
                    className="object-contain"
                  />
                </div>
                {caption && (
                  <figcaption className="text-center text-sm text-muted-foreground mt-2">{caption}</figcaption>
                )}
              </figure>
            )

          case "code":
            return (
              <pre key={id} className="p-4 bg-muted rounded-md overflow-x-auto">
                <code>
                  {block.code.rich_text.map((text: any, index: number) => (
                    <span key={index}>{text.plain_text}</span>
                  ))}
                </code>
              </pre>
            )

          case "quote":
            return (
              <blockquote key={id} className="border-l-4 pl-4 italic">
                {block.quote.rich_text.map((text: any, index: number) => (
                  <RichText key={index} text={text} />
                ))}
              </blockquote>
            )

          case "divider":
            return <hr key={id} className="my-8" />

          default:
            return (
              <div key={id} className="text-muted-foreground">
                Unsupported block type: {type}
              </div>
            )
        }
      })}
    </div>
  )
}

function RichText({ text }: { text: any }) {
  if (!text) return null

  let content = text.plain_text || ""

  if (text.href) {
    return (
      <Link href={text.href} className="text-primary underline">
        {content}
      </Link>
    )
  }

  if (text.annotations.bold) {
    content = <strong>{content}</strong>
  }

  if (text.annotations.italic) {
    content = <em>{content}</em>
  }

  if (text.annotations.strikethrough) {
    content = <s>{content}</s>
  }

  if (text.annotations.underline) {
    content = <u>{content}</u>
  }

  if (text.annotations.code) {
    content = <code className="bg-muted px-1 py-0.5 rounded">{content}</code>
  }

  return <>{content}</>
}
