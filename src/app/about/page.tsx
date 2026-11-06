import CreatorSupport from "@/components/home/CreatorSupport";

export default function AboutPage() {
  return (
    <main>
      <section className="mx-auto max-w-3xl px-6 pt-16 text-center">
        <h1 className="text-4xl font-semibold">About StudioSpace</h1>

        <p className="mt-5 leading-relaxed text-muted-foreground">
          StudioSpace helps photographers, filmmakers, podcasters, musicians,
          and artists find spaces for their next project. Hosts can list
          creative spaces, and creators can browse them and request a booking.
        </p>
      </section>

      <CreatorSupport />
    </main>
  );
}
