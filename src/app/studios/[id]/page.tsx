import { Suspense } from "react";
import StudioGallery from "@/components/studios/StudioGallery";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { StudioDetails } from "@/types/studio";
import BookStudioButton from "@/components/studios/BookStudioButton";

interface StudioDetailsPageProps {
  params: Promise<{ id: string }>;
}

async function StudioDetailsContent({ params }: StudioDetailsPageProps) {
  const { id } = await params;

  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    notFound();
  }

  let studio: StudioDetails | null = null;
  let missing = false;

  try {
    const response = await fetch(`${process.env.API_URL}/api/studios/${id}`, {
      cache: "no-store",
    });

    if (response.status === 404) {
      missing = true;
    } else {
      if (!response.ok) {
        throw new Error("Failed to load studio");
      }

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error("Invalid studio response");
      }

      studio = result.data;
    }
  } catch {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-semibold">Unable to load this studio</h1>

        <p className="mt-4 text-muted-foreground">
          Please refresh to try again.
        </p>

        <Link
          href="/studios"
          className="mt-6 inline-block font-semibold text-red-600"
        >
          Browse studios →
        </Link>
      </div>
    );
  }

  if (missing || !studio) {
    notFound();
  }

  return (
    <>
      <Link
        href="/studios"
        className="text-sm font-semibold text-red-600 hover:underline"
      >
        ← Back to studios
      </Link>

      <div className="mt-8">
        <span className="rounded-full bg-red-600/10 px-4 py-2 text-xs font-semibold text-red-600">
          {studio.category}
        </span>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight md:text-5xl">
          {studio.title}
        </h1>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <p>{studio.location}</p>

          <p>
            {studio.reviewCount > 0
              ? `★ ${studio.rating.toFixed(1)} · ${studio.reviewCount} reviews`
              : "New studio · No reviews yet"}
          </p>
        </div>
      </div>

      <StudioGallery
        title={studio.title}
        imageUrl={studio.imageUrl}
        gallery={studio.gallery}
      />

      <div className="mt-12 grid items-start gap-10 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <section>
            <h2 className="text-2xl font-semibold">About this space</h2>

            <p className="mt-4 leading-relaxed whitespace-pre-line text-muted-foreground">
              {studio.overview}
            </p>
          </section>

          <section className="border-t border-border pt-8">
            <h2 className="text-2xl font-semibold">What this space offers</h2>

            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {studio.amenities.map((amenity) => (
                <li
                  key={amenity}
                  className="rounded-2xl border border-border px-4 py-3 text-sm"
                >
                  <span aria-hidden="true" className="mr-2 text-red-600">
                    ✓
                  </span>
                  {amenity}
                </li>
              ))}
            </ul>
          </section>

          <section className="border-t border-border pt-8">
            <h2 className="text-2xl font-semibold">Meet your host</h2>
            <section className="border-t border-border pt-8">
              <h2 className="text-2xl font-semibold">Studio Reviews</h2>

              {studio.reviews?.length ? (
                <div className="mt-5 space-y-4">
                  {studio.reviews.map((review, index) => (
                    <article
                      key={`${review.name}-${index}`}
                      className="rounded-2xl border border-border bg-card p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-semibold">{review.name}</h3>
                        <p className="text-sm font-medium text-foreground">
                          ★ {review.rating} / 5
                        </p>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {review.comment}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-muted-foreground">No reviews yet.</p>
              )}
            </section>
            <p className="mt-4 text-muted-foreground">
              Hosted by{" "}
              <span className="font-medium text-foreground">
                {studio.ownerName}
              </span>
            </p>
          </section>
        </div>

        <aside
          aria-label="Studio pricing and capacity"
          className="rounded-3xl border border-border bg-card p-7 text-card-foreground shadow-sm lg:sticky lg:top-28"
        >
          <p>
            <span className="text-3xl font-bold">${studio.hourlyRate}</span>
            <span className="text-muted-foreground"> / hour</span>
          </p>

          <dl className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Security deposit</dt>
              <dd className="font-medium">${studio.securityDeposit}</dd>
            </div>

            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Maximum capacity</dt>
              <dd className="font-medium">{studio.maxCapacity} people</dd>
            </div>
          </dl>

          <BookStudioButton studioId={studio._id} title={studio.title} />

          <p className="mt-3 text-center text-xs text-muted-foreground">
            Prices are listed in USD.
          </p>
        </aside>
      </div>
    </>
  );
}

function StudioDetailsLoading() {
  return (
    <div role="status" aria-label="Loading studio details">
      <p className="sr-only">Loading studio details...</p>

      <div aria-hidden="true" className="space-y-6 motion-safe:animate-pulse">
        <div className="h-12 w-2/3 rounded-xl bg-muted" />
        <div className="h-6 w-1/3 rounded-xl bg-muted" />
        <div className="aspect-4/3 rounded-3xl bg-muted md:aspect-16/7" />
      </div>
    </div>
  );
}

export default function StudioDetailsPage({ params }: StudioDetailsPageProps) {
  return (
    <main className="bg-background px-6 py-12 md:py-16">
      <div className="mx-auto max-w-7xl">
        <Suspense fallback={<StudioDetailsLoading />}>
          <StudioDetailsContent params={params} />
        </Suspense>
      </div>
    </main>
  );
}
