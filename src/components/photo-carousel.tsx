"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

const photos = [
  {
    src: "/images/fernanda-v2-1.png",
    alt: "Fernanda Abreu em pointe em cenário urbano",
  },
  {
    src: "/images/fernanda-v2-2b.png",
    alt: "Fernanda Abreu em pose de ballet ao ar livre",
  },
  {
    src: "/images/fernanda-v2-3.png",
    alt: "Fernanda Abreu em movimento em casa",
  },
  {
    src: "/images/fernanda-v2-4.png",
    alt: "Fernanda Abreu em exercício de flexibilidade",
  },
  {
    src: "/images/fernanda-v2-5.png",
    alt: "Fernanda Abreu em pose de ballet fitness no chão",
  },
];

export function PhotoCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  function prev() {
    setIndex((current) => (current === 0 ? photos.length - 1 : current - 1));
  }

  function next() {
    setIndex((current) => (current === photos.length - 1 ? 0 : current + 1));
  }

  useEffect(() => {
    if (paused) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current === photos.length - 1 ? 0 : current + 1));
    }, 5200);

    return () => window.clearInterval(timer);
  }, [paused, index]);

  return (
    <div
      className="relative mx-auto aspect-[3/4] w-full max-w-[20rem] overflow-hidden rounded-[2rem] bg-[var(--accent-soft)] sm:max-w-[22rem] md:max-w-none lg:max-w-[26rem]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={photos[index].src}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        >
          <Image
            src={photos[index].src}
            alt={photos[index].alt}
            fill
            className="object-cover object-center"
            sizes="(min-width: 1024px) 26rem, (min-width: 640px) 22rem, 20rem"
            priority={index === 0}
          />
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/20 via-transparent to-transparent" />

      <button
        type="button"
        onClick={prev}
        className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--accent)] transition hover:opacity-90 sm:left-4 sm:h-10 sm:w-10"
        aria-label="Foto anterior"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--accent)] transition hover:opacity-90 sm:right-4 sm:h-10 sm:w-10"
        aria-label="Próxima foto"
      >
        ›
      </button>

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all duration-500 ${
              i === index ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
            aria-label={`Ir para foto ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
