"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Login failed. Please try again.");
        return;
      }

      let destination = "/";

      try {
        const requestedURL = new URL(
          searchParams.get("next") || "/",
          window.location.origin,
        );

        if (
          requestedURL.origin === window.location.origin &&
          requestedURL.pathname !== "/login" &&
          requestedURL.pathname !== "/register"
        ) {
          destination =
            requestedURL.pathname + requestedURL.search + requestedURL.hash;
        }
      } catch {
        destination = "/";
      }

      toast.success("Welcome back to StudioSpace!");
      router.replace(destination);
      router.refresh();
    } catch {
      toast.error("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md rounded-3xl">
      <CardHeader className="text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-red-600">
          WELCOME BACK
        </p>

        <CardTitle className="mt-3 text-3xl">Log in to StudioSpace</CardTitle>

        <CardDescription>
          Your next creative session starts here.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </div>

          <div className="text-right">
            <button
              type="button"
              disabled={loading}
              onClick={() =>
                toast.info("Password reset is currently unavailable.")
              }
              className="text-sm font-medium text-red-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-red-600 text-white hover:bg-red-700"
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">OR</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <GoogleLoginButton
          callbackURL={searchParams.get("next") || "/"}
          disabled={loading}
        />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to StudioSpace?{" "}
          <Link
            href="/register"
            className="font-semibold text-red-600 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <Suspense
        fallback={
          <p role="status" className="text-muted-foreground">
            Loading login form...
          </p>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
