import Link from "next/link";
import StudioCard from "@/components/studios/StudioCard";
import type { Studio } from "@/types/studio";

export default async function FeaturedStudios() {
  let studios: Studio[] = [];

  try {
    const response = await fetch(
      `${process.env.API_URL}/api/studios/featured`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch featured studios");
    }

    const result = await response.json();

    if (!result.success || !Array.isArray(result.data)) {
      throw new Error("Invalid featured studios response");
    }

    studios = result.data;
  } catch {
    return (
      <section className="px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold">Featured Studios</h2>
        <p className="mt-4 text-muted-foreground">
          We couldn’t load the studios. Please refresh to try again.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="featured-heading"
      className="bg-background px-6 py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-red-600">
            DISCOVER YOUR NEXT CREATIVE SPACE
          </p>

          <h2
            id="featured-heading"
            className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl"
          >
            Featured Studios
          </h2>

          <p className="mt-5 leading-relaxed text-muted-foreground">
            Explore our newest spaces for your next shoot, recording, or
            creative session.
          </p>
        </div>

        {studios.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-border p-10 text-center">
            <p className="text-muted-foreground">
              New creative spaces are on their way. Check back soon.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/studios"
            className="inline-flex rounded-full bg-red-600 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            Explore All Studios →
          </Link>
        </div>
      </div>
    </section>
  );
}
