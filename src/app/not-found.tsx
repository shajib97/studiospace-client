import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-20 text-center">
      <div className="max-w-md">
        <svg
          viewBox="0 0 120 90"
          fill="none"
          aria-hidden="true"
          className="mx-auto mb-6 w-32 text-red-600"
        >
          <path
            d="M18 27h19l8-11h30l8 11h19a8 8 0 0 1 8 8v36a8 8 0 0 1-8 8H18a8 8 0 0 1-8-8V35a8 8 0 0 1 8-8Z"
            stroke="currentColor"
            strokeWidth="4"
          />
          <circle
            cx="60"
            cy="52"
            r="17"
            stroke="currentColor"
            strokeWidth="4"
          />
          <circle cx="94" cy="40" r="3" fill="currentColor" />
        </svg>

        <p className="text-sm font-semibold text-red-600">404</p>
        <h1 className="mt-2 text-3xl font-semibold">
          This space is out of frame
        </h1>

        <p className="mt-4 text-muted-foreground">
          The page you’re looking for may have moved or been removed.
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700"
        >
          Return to Home
        </Link>
      </div>
    </main>
  );
}
