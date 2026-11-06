import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { createApiToken } from "@/lib/api-token";
import CancelBookingButton from "@/components/studios/CancelBookingButton";

interface Booking {
  _id: string;
  studioTitle?: string;
  startTime: string;
  endTime: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
}

const dateFormat = new Intl.DateTimeFormat("en-BD", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Dhaka",
});

const statusStyles = {
  Pending: "bg-amber-100 text-amber-900",
  Confirmed: "bg-green-100 text-green-900",
  Completed: "bg-blue-100 text-blue-900",
  Cancelled: "bg-neutral-200 text-neutral-800",
};

async function BookingsContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?next=%2Fmy-bookings");
  }

  let bookings: Booking[];

  try {
    const token = await createApiToken(session.user.id);
    const response = await fetch(`${process.env.API_URL}/api/bookings/mine`, {
      cache: "no-store",
      headers: { Cookie: `studiospace_api_token=${token}` },
    });

    const result = await response.json();

    if (!response.ok || !result.success || !Array.isArray(result.data)) {
      throw new Error("Unable to load bookings");
    }

    bookings = result.data;
  } catch {
    return (
      <p className="mt-6 text-muted-foreground">
        We couldn’t load your bookings. Please refresh to try again.
      </p>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-border p-8 text-center">
        <h2 className="text-xl font-semibold">No bookings yet</h2>
        <Link
          href="/studios"
          className="mt-4 inline-block font-semibold text-red-600 hover:underline"
        >
          Explore Studios →
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      {bookings.map((booking) => (
        <article
          key={booking._id}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">
              {booking.studioTitle ?? "Studio no longer listed"}
            </h2>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[booking.status]}`}
            >
              {booking.status}
            </span>
          </div>

          <dl className="mt-5 space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Starts</dt>
              <dd>{dateFormat.format(new Date(booking.startTime))}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Ends</dt>
              <dd>{dateFormat.format(new Date(booking.endTime))}</dd>
            </div>
          </dl>
          {booking.status === "Pending" && (
            <div className="mt-5">
              <CancelBookingButton bookingId={booking._id} />
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-semibold">My Bookings</h1>
      <p className="mt-2 text-muted-foreground">
        Track your studio requests. Times are shown in Bangladesh time.
      </p>

      <Suspense
        fallback={
          <p role="status" className="mt-6">
            Loading bookings...
          </p>
        }
      >
        <BookingsContent />
      </Suspense>
    </main>
  );
}
