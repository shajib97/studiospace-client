import { Suspense } from "react";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import AddStudioForm from "@/components/studios/AddStudioForm";
import { createApiToken } from "@/lib/api-token";
import { auth } from "@/lib/auth";
import type { StudioDetails } from "@/types/studio";

interface EditStudioPageProps {
  params: Promise<{ id: string }>;
}

async function EditStudioContent({ params }: EditStudioPageProps) {
  const { id } = await params;

  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/login?next=${encodeURIComponent(`/studios/edit/${id}`)}`);
  }

  let studio: StudioDetails | null = null;

  try {
    const token = await createApiToken(session.user.id);

    const response = await fetch(
      `${process.env.API_URL}/api/studios/mine/${id}`,
      {
        cache: "no-store",
        headers: { Cookie: `studiospace_api_token=${token}` },
      },
    );

    if (response.status !== 404) {
      const result = await response.json();

      if (!response.ok || !result.success || !result.data) {
        throw new Error("Unable to load studio");
      }

      studio = result.data;
    }
  } catch {
    return (
      <p className="mt-6 text-muted-foreground">
        We couldn’t load this studio. Please refresh to try again.
      </p>
    );
  }

  if (!studio) {
    notFound();
  }

  return (
    <AddStudioForm
      studio={studio}
      ownerName={session.user.name}
      ownerEmail={session.user.email}
    />
  );
}

export default function EditStudioPage({ params }: EditStudioPageProps) {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Edit Studio</h1>

      <Suspense fallback={<p role="status">Loading studio...</p>}>
        <EditStudioContent params={params} />
      </Suspense>
    </main>
  );
}
