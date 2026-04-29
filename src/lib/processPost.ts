import type { PageObjectResponse, ImageBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { ProcessedPost } from "@/types/post";

function extractImageUrl(post: PageObjectResponse, blocks: Array<any>): string | undefined {
  const fileProperty = post.properties.File as unknown as {
    type: "file" | "files";
    file?: { url: string };
    files?: Array<{
      type: "file" | "external";
      file?: { url: string };
      external?: { url: string };
    }>;
  } | undefined;

  const cover = post.cover;
  const coverUrl = cover
    ? cover.type === "external"
      ? cover.external.url
      : cover.file.url
    : undefined;

  const imageBlock = blocks.find(
    (b: any) => b.type === "image" && b.postId === post.id
  ) as ImageBlockObjectResponse | undefined;

  const fromBlock = imageBlock
    ? imageBlock.image.type === "external"
      ? imageBlock.image.external.url
      : imageBlock.image.file.url
    : undefined;

  return (
    fromBlock ||
    fileProperty?.file?.url ||
    fileProperty?.files?.[0]?.file?.url ||
    fileProperty?.files?.[0]?.external?.url ||
    coverUrl
  );
}

export function processPost(post: PageObjectResponse, blocks: Array<any>): ProcessedPost {
  const titleProp = post.properties.Title as { title: Array<{ plain_text: string }> };
  const slugProp = post.properties.Slug;
  const dateProp = post.properties.PublishedDate as { date: { start: string } | null };
  const tagsProp = post.properties.Tags as { multi_select: Array<{ id: string; name: string }> } | undefined;
  const descProp = post.properties.Description as { rich_text: Array<{ plain_text: string }> } | undefined;

  const slug =
    slugProp?.type === "rich_text"
      ? slugProp.rich_text[0]?.plain_text || post.id
      : slugProp?.type === "title"
      ? slugProp.title[0]?.plain_text || post.id
      : post.id;

  return {
    id: post.id,
    title: titleProp.title[0]?.plain_text || "Untitled",
    slug,
    imageUrl: extractImageUrl(post, blocks),
    date: dateProp?.date?.start,
    tags: tagsProp?.multi_select ?? [],
    description: descProp?.rich_text[0]?.plain_text,
  };
}
