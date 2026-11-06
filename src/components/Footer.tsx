import Link from "next/link";

const categories = [
  { name: "Photo Studios", value: "Photo Studio" },
  { name: "Sound Stages", value: "Film Stage" },
  { name: "Podcast Rooms", value: "Podcast Lounge" },
  { name: "Music Suites", value: "Music Suite" },
  { name: "Art Workshops", value: "Workshop" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/40 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-red-600"
            >
              StudioSpace
            </Link>

            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Connecting creative people with inspiring spaces for photography,
              film, podcasts, music, and art.
            </p>

            <a
              href="https://github.com/shajib97/studiospace-client"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex text-sm font-semibold hover:text-red-600"
            >
              View our project on GitHub →
            </a>
            <a
              href="https://x.com/intent/post?text=Explore%20creative%20studios%20on%20StudioSpace"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share StudioSpace on X"
              className="mt-4 flex size-9 items-center justify-center rounded-full border border-border hover:text-red-600"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-4 fill-current"
                aria-hidden="true"
              >
                <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.59-6.64 7.59H.47l8.6-9.84L0 1.15h7.59l5.25 6.94 6.06-6.94Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41Z" />
              </svg>
            </a>
          </div>

          <div>
            <h2 className="font-semibold">Explore StudioSpace</h2>

            <nav
              aria-label="Footer navigation"
              className="mt-5 flex flex-col items-start gap-3 text-sm text-muted-foreground"
            >
              <Link href="/" className="hover:text-red-600">
                Home
              </Link>

              <Link href="/studios" className="hover:text-red-600">
                Explore Studios
              </Link>

              <Link href="/how-it-works" className="hover:text-red-600">
                How It Works
              </Link>

              <Link href="/about" className="hover:text-red-600">
                About Us
              </Link>
            </nav>
          </div>

          <div>
            <h2 className="font-semibold">Popular Categories</h2>

            <nav
              aria-label="Studio categories"
              className="mt-5 flex flex-col items-start gap-3 text-sm text-muted-foreground"
            >
              {categories.map((category) => (
                <Link
                  key={category.value}
                  href={`/studios?category=${encodeURIComponent(category.value)}`}
                  className="hover:text-red-600"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="font-semibold">Stay Inspired</h2>

            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Studio discoveries and ideas for your next creative session.
            </p>

            <label
              htmlFor="newsletter-email"
              className="mt-5 block text-sm font-medium"
            >
              Email address
            </label>

            <input
              id="newsletter-email"
              type="email"
              placeholder="you@example.com"
              disabled
              aria-describedby="newsletter-status"
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            />

            <p
              id="newsletter-status"
              className="mt-2 text-xs text-muted-foreground"
            >
              Newsletter signup is coming soon.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 StudioSpace. All rights reserved.</p>

          <p>Studio rules and booking terms apply to each reservation.</p>
        </div>
      </div>
    </footer>
  );
}
