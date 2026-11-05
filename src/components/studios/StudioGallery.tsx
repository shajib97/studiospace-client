"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface StudioGalleryProps {
  title: string;
  imageUrl: string;
  gallery?: string[];
}

export default function StudioGallery({
  title,
  imageUrl,
  gallery = [],
}: StudioGalleryProps) {
  const images = [imageUrl, ...gallery].filter(
    (image, index, allImages) =>
      image.trim() !== "" && allImages.indexOf(image) === index,
  );

  const hasMultipleImages = images.length > 1;

  return (
    <section aria-label={`${title} photo gallery`} className="mt-8">
      <Swiper
        modules={[A11y, Keyboard, Navigation, Pagination]}
        slidesPerView={1}
        navigation={hasMultipleImages}
        pagination={hasMultipleImages ? { clickable: true } : false}
        keyboard={{ enabled: true, onlyInViewport: true }}
        allowTouchMove={hasMultipleImages}
        watchOverflow
        className="overflow-hidden rounded-3xl [--swiper-navigation-color:white] [--swiper-navigation-size:24px] [--swiper-pagination-color:white]"
      >
        {images.map((image, index) => (
          <SwiperSlide key={image}>
            <div className="relative aspect-4/3 bg-muted md:aspect-16/7">
              <Image
                src={image}
                alt={`${title} — photo ${index + 1}`}
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                loading={index === 0 ? "eager" : "lazy"}
                className="object-cover"
              />

              {hasMultipleImages && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent"
                />
              )}

              <span className="absolute top-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
                {index + 1} / {images.length}
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
