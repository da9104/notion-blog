import { notionFetch } from "@/lib/notion";
import { processPost } from "@/lib/processPost";
import { JournalPage } from "@/components/search/JournalPage";
import { PageLayout } from "@/components/layout/page-layout";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";

  const { data, blocks } = await notionFetch({});

  const posts = ((data ?? []) as PageObjectResponse[])
    .filter((p): p is PageObjectResponse => "properties" in p)
    .map((p) => processPost(p, blocks));

  return (
    <PageLayout>
      <JournalPage posts={posts} query={query} />
    </PageLayout>
  );
}
