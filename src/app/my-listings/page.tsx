import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import StudioCard from "@/components/studios/StudioCard";
import { createApiToken } from "@/lib/api-token";
import { auth } from "@/lib/auth";
import type { Studio } from "@/types/studio";
import DeleteStudioButton from "@/components/studios/DeleteStudioButton";

async function MyListingsContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?next=%2Fmy-listings");
  }

  let studios: Studio[];

  try {
    const apiURL = process.env.API_URL;

    if (!apiURL) {
      throw new Error("API_URL must be set in .env");
    }

    const token = await createApiToken(session.user.id);

    const response = await fetch(`${apiURL}/api/studios/mine`, {
      cache: "no-store",
      headers: {
        Cookie: `studiospace_api_token=${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success || !Array.isArray(result.data)) {
      throw new Error("Unable to load studio listings");
    }

    studios = result.data;
  } catch {
    return (
      <p className="mt-8 rounded-2xl border border-border p-6 text-muted-foreground">
        We couldn’t load your studios. Please refresh to try again.
      </p>
    );
  }

  if (studios.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-border p-8 text-center">
        <h2 className="text-xl font-semibold">No studios listed yet</h2>
        <p className="mt-2 text-muted-foreground">
          Add your first studio to start hosting creators.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {studios.map((studio) => (
        <div key={studio._id} className="flex flex-col gap-3">
          <StudioCard studio={studio} />

          <div className="flex justify-end gap-3">
            <Link
              href={`/studios/edit/${studio._id}`}
              className="inline-flex items-center rounded-full border border-border px-4 text-sm font-medium hover:bg-muted"
            >
              Edit
            </Link>

            <DeleteStudioButton studioId={studio._id} title={studio.title} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MyListingsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">My Studio Listings</h1>
          <p className="mt-2 text-muted-foreground">
            View the creative spaces you’ve listed.
          </p>
        </div>

        <Link
          href="/add-studio"
          className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
        >
          Add New Studio
        </Link>
      </div>

      <Suspense
        fallback={
          <p role="status" className="mt-8">
            Loading your studios...
          </p>
        }
      >
        <MyListingsContent />
      </Suspense>
    </main>
  );
}
