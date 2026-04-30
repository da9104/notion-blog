export const dynamic = 'force-dynamic';

import { PageLayout } from "@/components/layout/page-layout";
import { notionFetch } from "@/lib/notion";
import { FeaturedHero } from "@/components/home/FeaturedHero";
import { ForYouSection } from "@/components/home/ForYouSection";
import { InsightBlock } from "@/components/home/InsightBlock";
import { ProfileCard } from "@/components/home/ProfileCard";
import { ContactSection } from "@/components/home/ContactSection";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { processPost } from "@/lib/processPost";

export default async function Home() {
  const { data, blocks } = await notionFetch({});

  const posts = ((data ?? []) as PageObjectResponse[])
    .filter((p): p is PageObjectResponse => "properties" in p)
    .map((p) => processPost(p, blocks));

  const featured = posts.find(p => p.featured);
  const forYou = posts.filter(p => !p.featured).slice(0, 6);

  if (!featured) {
    return (
      <PageLayout>
        <div className="max-w-[1100px] mx-auto px-[var(--sides)] py-32 text-center">
          <p className="text-[var(--tertiary)]" style={{ fontFamily: 'var(--font-body)' }}>
            No posts published yet.
          </p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <FeaturedHero post={featured} />
      <ForYouSection posts={forYou} />
      <InsightBlock />
      <ProfileCard />
      <ContactSection />
    </PageLayout>
  );
}
