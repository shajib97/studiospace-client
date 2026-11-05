import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

async function DashboardContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?next=%2Fdashboard");
  }

  return (
    <>
      <p className="text-sm font-semibold text-red-600">YOUR ACCOUNT</p>

      <h1 className="mt-3 text-3xl font-semibold">
        Welcome, {session.user.name}
      </h1>

      <p className="mt-3 text-muted-foreground">
        This is your StudioSpace dashboard.
      </p>
    </>
  );
}

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <Suspense fallback={<p role="status">Loading dashboard...</p>}>
        <DashboardContent />
      </Suspense>
    </main>
  );
}
