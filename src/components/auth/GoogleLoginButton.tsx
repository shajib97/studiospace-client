"use client";

import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

interface GoogleLoginButtonProps {
  callbackURL?: string;
  disabled?: boolean;
}

export default function GoogleLoginButton({
  callbackURL = "/",
  disabled = false,
}: GoogleLoginButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    if (loading || disabled) return;

    setLoading(true);

    try {
      let destination = "/";

      const requestedURL = new URL(callbackURL, window.location.origin);

      if (
        requestedURL.origin === window.location.origin &&
        requestedURL.pathname !== "/login" &&
        requestedURL.pathname !== "/register"
      ) {
        destination =
          requestedURL.pathname + requestedURL.search + requestedURL.hash;
      }

      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: destination,
      });

      if (error) {
        toast.error(
          error.message || "Unable to start Google login. Please try again.",
        );
      }
    } catch {
      toast.error("Unable to connect to Google login. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={loading || disabled}
      onClick={handleGoogleLogin}
      className="w-full rounded-full"
    >
      {loading ? "Connecting to Google..." : "Continue with Google"}
    </Button>
  );
}
