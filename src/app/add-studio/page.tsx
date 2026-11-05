import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AddStudioForm from "@/components/studios/AddStudioForm";

async function AddStudioContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?next=%2Fadd-studio");
  }

  return (
    <AddStudioForm
      ownerName={session.user.name}
      ownerEmail={session.user.email}
    />
  );
}

export default function AddStudioPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Add New Studio</h1>

      <Suspense fallback={<p role="status">Loading studio form...</p>}>
        <AddStudioContent />
      </Suspense>
    </main>
  );
}
