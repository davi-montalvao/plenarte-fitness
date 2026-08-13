"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

const photos = [
  { src: "/images/fernanda-1.png", alt: "Fernanda Abreu em movimento na natureza" },
  { src: "/images/fernanda-2.png", alt: "Fernanda Abreu em movimento em casa" },
  { src: "/images/fernanda-3.png", alt: "Fernanda Abreu em pose de ballet ao ar livre" },
  { src: "/images/fernanda-4.png", alt: "Fernanda Abreu em exercício de ballet fitness" },
];

export function PhotoCarousel() {
  const [index, setIndex] = useState(0);

  function prev() {
    setIndex((current) => (current === 0 ? photos.length - 1 : current - 1));
  }

  function next() {
    setIndex((current) => (current === photos.length - 1 ? 0 : current + 1));
  }

  return (
    <div className="relative min-h-[480px] overflow-hidden rounded-[2.5rem] lg:min-h-[560px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={photos[index].src}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <Image
            src={photos[index].src}
            alt={photos[index].alt}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
            priority={index === 0}
          />
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        onClick={prev}
        className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--accent)]"
        aria-label="Foto anterior"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--accent)]"
        aria-label="Próxima foto"
      >
        ›
      </button>

      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full ${
              i === index ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Ir para foto ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
