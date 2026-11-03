import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Discover spaces",
    description:
      "Explore creative studios and find the location, equipment, and atmosphere you need.",
  },
  {
    number: "02",
    title: "Select shoot hours",
    description:
      "Choose your date and start and end times to plan your creative session.",
  },
  {
    number: "03",
    title: "Request your booking",
    description:
      "Submit your reservation and track confirmation from the studio host.",
  },
  {
    number: "04",
    title: "Create and produce",
    description:
      "Once confirmed, arrive at your booked time and bring your ideas to life.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="booking-steps-heading"
      className="bg-muted/40 px-6 py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-red-600">
            FROM IDEA TO CREATION
          </p>

          <h2
            id="booking-steps-heading"
            className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl"
          >
            Your next session starts here.
          </h2>

          <p className="mt-5 leading-relaxed text-muted-foreground">
            Find your space and arrange your next creative session in four
            simple steps.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number} className="border-t border-border pt-6">
              <span className="text-4xl font-semibold text-red-600">
                {step.number}
              </span>

              <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/studios"
            className="inline-flex rounded-full bg-red-600 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            Find Your Studio →
          </Link>
        </div>
      </div>
    </section>
  );
}
