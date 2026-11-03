"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  {
    id: 1,
    category: "PHOTOGRAPHY STUDIOS",
    title: "The space behind your next great shot.",
    description:
      "Discover beautiful studios with the lighting, equipment, and room to bring your vision to life.",
    image: "/images/hero-photo.jpg",
    alt: "Photography studio with professional lighting equipment",
  },
  {
    id: 2,
    category: "PODCAST ROOMS",
    title: "Great conversations deserve a great space.",
    description:
      "Find a recording-ready room for your next interview, podcast episode, or creative conversation.",
    image: "/images/hero-podcast.jpg",
    alt: "Podcast recording room with microphones",
  },
  {
    id: 3,
    category: "MUSIC SUITES",
    title: "Make room for your next big sound.",
    description:
      "Explore inspiring music studios for recording, rehearsing, and creating something memorable.",
    image: "/images/hero-music.jpg",
    alt: "Music recording studio with audio equipment",
  },
];

export default function Hero() {
  return (
    <section aria-label="Discover creative studios">
      <Swiper
        modules={[A11y, Keyboard, Navigation, Pagination]}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        keyboard={{ enabled: true, onlyInViewport: true }}
        loop
        speed={700}
        className="[--swiper-navigation-color:white] [--swiper-navigation-size:24px] [--swiper-pagination-color:white]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative isolate flex min-h-140 items-center bg-neutral-950 md:min-h-170">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                sizes="100vw"
                priority={index === 0}
                className="-z-20 object-cover"
              />

              <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/85 via-black/55 to-black/20" />

              <div className="mx-auto w-full max-w-7xl px-12 py-24 md:px-20">
                <div className="max-w-2xl">
                  <p className="mb-5 text-xs font-semibold tracking-[0.2em] text-white/80 md:text-sm">
                    {slide.category}
                  </p>

                  {index === 0 ? (
                    <h1 className="text-4xl leading-tight font-semibold tracking-tight text-white md:text-6xl">
                      {slide.title}
                    </h1>
                  ) : (
                    <h2 className="text-4xl leading-tight font-semibold tracking-tight text-white md:text-6xl">
                      {slide.title}
                    </h2>
                  )}

                  <p className="mt-6 max-w-lg text-base leading-relaxed text-white/80 md:text-lg">
                    {slide.description}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                      href="/studios"
                      className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                    >
                      Explore Studios
                    </Link>

                    <Link
                      href="/studios"
                      className="rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15"
                    >
                      Host Your Space
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
