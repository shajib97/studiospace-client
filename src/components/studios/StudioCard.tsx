import Image from "next/image";
import Link from "next/link";
import type { Studio } from "@/types/studio";

interface StudioCardProps {
  studio: Studio;
}

export default function StudioCard({ studio }: StudioCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-sm">
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={studio.imageUrl}
          alt={studio.title}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <span className="absolute top-4 left-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-900">
          {studio.category}
        </span>

        <span className="absolute right-4 bottom-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-900">
          {studio.reviewCount > 0 ? `★ ${studio.rating.toFixed(1)}` : "New"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm text-muted-foreground">{studio.location}</p>

        <h3 className="mt-2 text-xl font-semibold">{studio.title}</h3>

        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          <p>
            <span className="text-xl font-bold">${studio.hourlyRate}</span>
            <span className="text-sm text-muted-foreground"> / hr</span>
          </p>

          <Link
            href={`/studios/${studio._id}`}
            className="text-sm font-semibold text-red-600 hover:underline"
          >
            View Details →
          </Link>
        </div>
      </div>
    </article>
  );
}
