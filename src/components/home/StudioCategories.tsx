import Link from "next/link";

const categories = [
  {
    name: "Photo Studios",
    value: "Photo Studio",
    number: "01",
    description: "Find the right light for portraits, products, and campaigns.",
  },
  {
    name: "Sound Stages",
    value: "Film Stage",
    number: "02",
    description: "Make space for your next film, commercial, or production.",
  },
  {
    name: "Podcast Rooms",
    value: "Podcast Lounge",
    number: "03",
    description: "Record clear conversations in a space built for your voice.",
  },
  {
    name: "Music Suites",
    value: "Music Suite",
    number: "04",
    description: "Record, rehearse, and bring your next sound to life.",
  },
  {
    name: "Art Workshops",
    value: "Workshop",
    number: "05",
    description: "Explore welcoming spaces for making, teaching, and creating.",
  },
];

export default function StudioCategories() {
  return (
    <section
      aria-labelledby="categories-heading"
      className="bg-background px-6 py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-red-600">
            SPACE FOR EVERY IDEA
          </p>

          <h2
            id="categories-heading"
            className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-5xl"
          >
            What will you create next?
          </h2>

          <p className="mt-5 leading-relaxed text-muted-foreground">
            From your first recording to your next big production, discover a
            space that fits your creative process.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.value}
              href={`/studios?category=${encodeURIComponent(category.value)}`}
              className="group flex h-full flex-col rounded-3xl border border-border bg-card p-7 text-card-foreground shadow-sm transition-colors hover:border-red-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-red-600/10 text-sm font-semibold text-red-600">
                {category.number}
              </span>

              <h3 className="mt-6 text-xl font-semibold">{category.name}</h3>

              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {category.description}
              </p>

              <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-red-600">
                Explore spaces
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
