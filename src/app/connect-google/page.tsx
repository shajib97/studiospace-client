"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function ConnectGooglePage() {
  const { data: session, isPending, error, refetch } = authClient.useSession();

  const [connecting, setConnecting] = useState(false);

  async function connectGoogle() {
    if (!session || connecting) return;

    setConnecting(true);

    try {
      const { error } = await authClient.linkSocial({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.error(
          error.message || "Unable to connect Google. Please try again.",
        );
      }
    } catch {
      toast.error("Unable to connect. Please try again.");
    } finally {
      setConnecting(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <section className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-card-foreground shadow-sm">
        <h1 className="text-2xl font-semibold">Connect Google</h1>

        {isPending ? (
          <p role="status" className="mt-5 text-muted-foreground">
            Loading your account...
          </p>
        ) : error ? (
          <div className="mt-5 space-y-4">
            <p>Unable to load your account.</p>
            <Button onClick={() => refetch()}>Try again</Button>
          </div>
        ) : session ? (
          <>
            <p className="mt-5 text-sm text-muted-foreground">
              You’re connecting Google to:
            </p>

            <p className="mt-2 break-all font-medium">{session.user.email}</p>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Choose the Google account with this same email address.
            </p>

            <Button
              type="button"
              onClick={connectGoogle}
              disabled={connecting}
              className="mt-6 w-full rounded-full bg-red-600 text-white hover:bg-red-700"
            >
              {connecting ? "Connecting..." : "Connect Google"}
            </Button>
          </>
        ) : (
          <div className="mt-5">
            <p className="text-muted-foreground">
              Log in with your email and password before connecting Google.
            </p>

            <Link
              href="/login?next=%2Fconnect-google"
              className="mt-5 inline-block font-semibold text-red-600"
            >
              Log in →
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
