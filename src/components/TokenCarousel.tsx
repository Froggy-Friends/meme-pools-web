"use client";

import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import { ReactNode, useCallback } from "react";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

type TokenCarouselProps = {
  children: ReactNode;
  options?: EmblaOptionsType;
};

export default function TokenCarousel({ children }: TokenCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: true, axis: "x" });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="overflow-hidden my-10" ref={emblaRef}>
      <div className="flex gap-2 mb-2">{children}</div>

      <div className="flex gap-x-1 mt-6">
        <SlArrowLeft
          size={35}
          onClick={scrollPrev}
          className="bg-dark-gray p-2 rounded-lg hover:bg-white/[10%] hover:cursor-pointer"
        />
        <SlArrowRight
          size={35}
          onClick={scrollNext}
          className="bg-dark-gray p-2 rounded-lg hover:bg-white/[10%] hover:cursor-pointer"
        />
      </div>
    </section>
  );
}
