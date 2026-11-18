import type { Metadata } from "next";
import { ContentHero } from "@/components/content";
import { MarketplaceList } from "@/components/marketplace";

export const metadata: Metadata = { title: "Marketplace" };

export default function MarketplacePage() {
  return (
    <>
      <ContentHero
        eyebrow="Marketplace"
        title="Businesses raising money right now"
        intro="Every deal here has been checked and approved by our credit team. See what each business needs, what it's for and how much has been raised so far."
      />
      <section className="bg-white pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <MarketplaceList />
        </div>
      </section>
    </>
  );
}
