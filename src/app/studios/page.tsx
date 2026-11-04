import { Suspense } from "react";
import Link from "next/link";
import StudioCard from "@/components/studios/StudioCard";
import type { Studio } from "@/types/studio";

const categories = [
  { label: "All Studios", value: "" },
  { label: "Photo Studios", value: "Photo Studio" },
  { label: "Sound Stages", value: "Film Stage" },
  { label: "Podcast Rooms", value: "Podcast Lounge" },
  { label: "Music Suites", value: "Music Suite" },
  { label: "Art Workshops", value: "Workshop" },
];

interface StudiosPageProps {
  searchParams: Promise<{
    category?: string | string[];
  }>;
}

async function StudiosContent({ searchParams }: StudiosPageProps) {
  const params = await searchParams;
  const category = params.category ?? "";

  if (
    typeof category !== "string" ||
    !categories.some((item) => item.value === category)
  ) {
    return (
      <div className="py-12 text-center">
        <p>Please select a valid studio category.</p>

        <Link
          href="/studios"
          className="mt-4 inline-block font-semibold text-red-600"
        >
          View all studios →
        </Link>
      </div>
    );
  }

  const query = category ? `?category=${encodeURIComponent(category)}` : "";

  let studios: Studio[] = [];
  let loadFailed = false;

  try {
    const response = await fetch(`${process.env.API_URL}/api/studios${query}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to load studios");
    }

    const result = await response.json();

    if (!result.success || !Array.isArray(result.data)) {
      throw new Error("Invalid studios response");
    }

    studios = result.data;
  } catch {
    loadFailed = true;
  }

  return (
    <>
      <nav
        aria-label="Filter studios by category"
        className="mt-10 flex flex-wrap justify-center gap-3"
      >
        {categories.map((item) => (
          <Link
            key={item.label}
            href={
              item.value
                ? `/studios?category=${encodeURIComponent(item.value)}`
                : "/studios"
            }
            aria-current={category === item.value ? "page" : undefined}
            className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
              category === item.value
                ? "border-red-600 bg-red-600 text-white"
                : "border-border bg-background hover:bg-muted"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {loadFailed ? (
        <div className="mt-12 rounded-3xl border border-border p-10 text-center">
          <p className="text-muted-foreground">
            We couldn’t load the studios. Please refresh to try again.
          </p>
        </div>
      ) : studios.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-border p-10 text-center">
          <h2 className="text-xl font-semibold">No studios found</h2>

          <p className="mt-3 text-muted-foreground">
            Try another category to discover more creative spaces.
          </p>

          <Link
            href="/studios"
            className="mt-5 inline-block font-semibold text-red-600"
          >
            Browse all studios →
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-10 text-sm text-muted-foreground">
            {studios.length} {studios.length === 1 ? "studio" : "studios"} found
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

function StudiosLoading() {
  return (
    <div role="status" aria-label="Loading studios" className="mt-12">
      <p className="sr-only">Loading studios...</p>

      <div
        aria-hidden="true"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="h-96 rounded-3xl bg-muted motion-safe:animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

export default function StudiosPage({ searchParams }: StudiosPageProps) {
  return (
    <main className="bg-background px-6 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-red-600">
            FIND YOUR CREATIVE SPACE
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            Explore Studios
          </h1>

          <p className="mt-5 leading-relaxed text-muted-foreground">
            Discover spaces for photography, film, podcasts, music, and art.
            Find the right setting for your next idea.
          </p>
        </div>

        <Suspense fallback={<StudiosLoading />}>
          <StudiosContent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
