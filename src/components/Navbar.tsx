"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-4 z-50 mx-auto mt-4 w-[calc(100%-2rem)] max-w-7xl">
      <div className="rounded-[2rem] border border-border bg-background/95 px-5 py-3 shadow-sm backdrop-blur-md">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            onClick={closeMenu}
            className="text-xl font-bold tracking-tight text-red-600"
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

          <div className="hidden items-center gap-3 lg:flex">
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

          <div className="flex items-center gap-2">
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
          </nav>
        )}
      </div>
    </header>
  );
}
