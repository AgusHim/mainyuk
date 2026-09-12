"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const slides = [
  {
    src: "https://i.ibb.co.com/dtcz1tw/teori-of-life-1.png",
    alt: "teori-of-life-1",
  },
  {
    src: "https://i.ibb.co.com/kQw8pRK/teori-of-life-2.png",
    alt: "teori-of-life-2",
  },
  {
    src: "https://i.ibb.co.com/9s0bFzN/teori-of-life-3.png",
    alt: "teori-of-life-3",
  },
];

export function HomeCarousel() {
  return (
    <section className="mb-10">
      <div className="mb-10 rounded-full border border-black bg-yellow-300 py-2 shadow-custom">
        <h1 className="text-center text-3xl font-extrabold text-black">
          Momen Bahagia
        </h1>
      </div>
      <Carousel className="h-60" opts={{ loop: true }}>
        <CarouselContent className="ml-0 h-full">
          {slides.map((slide) => (
            <CarouselItem key={slide.src} className="relative h-full pl-0">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                loading="lazy"
                sizes="100vw"
                className="object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3" />
        <CarouselNext className="right-3" />
      </Carousel>
    </section>
  );
}
