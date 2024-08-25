"use client";

import { Carousel, CustomFlowbiteTheme } from "flowbite-react";

const carouselTheme: CustomFlowbiteTheme["carousel"] = {
  root: {
    base: "relative h-full w-full",
    leftControl:
      "absolute left-0 top-0 flex h-full items-center justify-center px-4 focus:outline-none",
    rightControl:
      "absolute right-0 top-0 flex h-full items-center justify-center px-4 focus:outline-none",
  },
  indicators: {
    active: {
      off: "bg-white/50 hover:bg-white dark:bg-gray-800/50 dark:hover:bg-gray-800",
      on: "bg-white dark:bg-gray-800",
    },
    base: "h-3 w-3 rounded-full",
    wrapper: "absolute bottom-5 left-1/2 flex -translate-x-1/2 space-x-3",
  },
  item: {
    base: "absolute left-1/2 top-1/2 block w-full -translate-x-1/2 -translate-y-1/2 rounded-3xl",
    wrapper: {
      off: "w-full flex-shrink-0 transform cursor-default snap-center",
      on: "w-full flex-shrink-0 transform cursor-grab snap-center",
    },
  },
  control: {
    base: "inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70 sm:h-10 sm:w-10",
    icon: "h-5 w-5 text-white dark:text-gray-800 sm:h-6 sm:w-6",
  },
  scrollContainer: {
    base: "flex h-full snap-mandatory overflow-y-hidden overflow-x-scroll scroll-smooth rounded-3xl",
    snap: "snap-x",
  },
};

export function HomeCarousel() {
  return (
    <section className="mb-10">
      <div className="mb-10 py-2 bg-yellow-300 border border-black rounded-full shadow-custom">
        <h1 className="text-black text-center font-extrabold text-3xl md:text-5xl">
          Momen Bahagia
        </h1>
      </div>
      <div className="h-75 md:h-150">
      <Carousel
        theme={carouselTheme}
        leftControl={<div></div>}
        rightControl={<div></div>}
      >
        <img
          className="h-full"
          src="https://i.ibb.co.com/dtcz1tw/teori-of-life-1.png"
          alt="teori-of-life-1"
        />
        <img
          className="h-full"
          src="https://i.ibb.co.com/kQw8pRK/teori-of-life-2.png"
          alt="teori-of-life-2"
        />
        <img
          className="h-full"
          src="https://i.ibb.co.com/9s0bFzN/teori-of-life-3.png"
          alt="teori-of-life-3"
        />
      </Carousel>
      </div>
      
    </section>
  );
}
