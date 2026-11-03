import Link from "next/link";

const benefits = [
  {
    number: "01",
    title: "Know your host",
    description:
      "View host details and reviews from completed bookings before choosing your space.",
  },
  {
    number: "02",
    title: "Clear responsibilities",
    description:
      "Discuss studio rules, security deposits, and responsibility for damage with your host before booking.",
  },
  {
    number: "03",
    title: "Care for the equipment",
    description:
      "Check the listed amenities and agree on equipment use so everyone can create with confidence.",
  },
  {
    number: "04",
    title: "Plan with confidence",
    description:
      "Keep your reservation details and booking status together, ready for your next session.",
  },
];

export default function CreatorSupport() {
  return (
    <section
      aria-labelledby="creator-support-heading"
      className="bg-background px-6 py-20 md:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-red-600">
            FOR HOSTS AND CREATORS
          </p>

          <h2
            id="creator-support-heading"
            className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl"
          >
            Great spaces.
            <br />
            Clear expectations.
          </h2>

          <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">
            A successful session starts before you arrive. Get to know the
            space, understand the details, and choose a studio that fits your
            next project.
          </p>

          <Link
            href="/studios"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:underline"
          >
            Explore creative spaces
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <div
              key={benefit.number}
              className="rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-sm"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-red-600/10 text-sm font-semibold text-red-600">
                {benefit.number}
              </span>

              <h3 className="mt-5 text-lg font-semibold">{benefit.title}</h3>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
