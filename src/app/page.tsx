import { Suspense } from "react";
import Hero from "@/components/home/Hero";
import StudioCategories from "@/components/home/StudioCategories";
import FeaturedStudios from "@/components/home/FeaturedStudios";
import HowItWorks from "@/components/home/HowItWorks";
import CreatorSupport from "@/components/home/CreatorSupport";

function FeaturedStudiosLoading() {
  return (
    <section
      role="status"
      aria-label="Loading featured studios"
      className="px-6 py-20"
    >
      <p className="sr-only">Loading featured studios...</p>

      <div
        aria-hidden="true"
        className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="h-96 rounded-3xl bg-muted motion-safe:animate-pulse"
          />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <Hero />
      <StudioCategories />

      <Suspense fallback={<FeaturedStudiosLoading />}>
        <FeaturedStudios />
      </Suspense>

      <HowItWorks />
      <CreatorSupport />
    </main>
  );
}
