"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import ThemeToggle from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about" },
];

const accountLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Add New Studio", href: "/add-studio" },
  { label: "My Studio Listings", href: "/my-listings" },
  { label: "My Bookings", href: "/my-bookings" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { data: session, isPending, error, refetch } = authClient.useSession();

  function closeMenu() {
    setMenuOpen(false);
  }

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const response = await fetch("/api/session/token", {
        method: "DELETE",
      });

      if (!response.ok) {
        toast.error("Unable to log out. Please try again.");
        return;
      }
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Unable to log out. Please try again.");
        return;
      }

      closeMenu();
      toast.success("You have been logged out.");
      router.replace("/");
      router.refresh();
    } catch {
      toast.error("Unable to connect. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-4 z-50 mx-auto mt-4 w-[calc(100%-2rem)] max-w-7xl">
      <div className="rounded-[2rem] border border-border bg-background/95 px-5 py-3 shadow-sm backdrop-blur-md">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            onClick={closeMenu}
            className="shrink-0 text-xl font-bold tracking-tight text-red-600"
          >
            StudioSpace
          </Link>

          <nav aria-label="Main navigation" className="hidden lg:flex lg:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-red-600 text-white"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {isPending ? (
              <div
                role="status"
                aria-label="Loading account"
                className="size-9 rounded-full bg-muted motion-safe:animate-pulse"
              />
            ) : session ? (
              <DropdownMenu
                onOpenChange={(open) => {
                  if (open) closeMenu();
                }}
              >
                <DropdownMenuTrigger
                  type="button"
                  aria-label="Open account menu"
                  className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Avatar className="size-9">
                    <AvatarImage
                      src={session.user.image || undefined}
                      alt={session.user.name || "Your profile"}
                    />
                    <AvatarFallback className="bg-red-600/10 font-semibold text-red-600">
                      {session.user.name?.trim().charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-60">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <p className="truncate font-semibold">
                        {session.user.name}
                      </p>
                      <p className="truncate text-xs font-normal text-muted-foreground">
                        {session.user.email}
                      </p>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    {accountLinks.map((link) => (
                      <DropdownMenuItem
                        key={link.href}
                        render={<Link href={link.href} />}
                        onClick={closeMenu}
                      >
                        {link.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    disabled={loggingOut}
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    {loggingOut ? "Logging out..." : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : error ? (
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-full border border-border px-3 py-2 text-xs"
                aria-label="Retry loading account"
              >
                Retry
              </button>
            ) : (
              <div className="hidden items-center gap-2 lg:flex">
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-full bg-red-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                >
                  Register
                </Link>
              </div>
            )}

            <ThemeToggle />

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className="rounded-full border border-border px-4 py-2 text-sm font-medium lg:hidden"
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="mt-4 flex flex-col gap-2 border-t border-border pt-4 lg:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                aria-current={pathname === link.href ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  pathname === link.href
                    ? "bg-red-600 text-white"
                    : "hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {!isPending && !session && !error && (
              <>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="rounded-full px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="rounded-full bg-red-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-red-700"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
