"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

type ImageSlide = {
  type: "image";
  src: string;
  alt: string;
};

type VideoSlide = {
  type: "video";
  src: string;
  alt: string;
};

type Slide = ImageSlide | VideoSlide;

const slides: Slide[] = [
  {
    type: "video",
    src: "/videos/fernanda-abreu.mp4",
    alt: "Fernanda Abreu em movimento — vídeo",
  },
  {
    type: "image",
    src: "/images/fernanda-v2-1.png",
    alt: "Fernanda Abreu em pointe em cenário urbano",
  },
  {
    type: "image",
    src: "/images/fernanda-v2-2b.png",
    alt: "Fernanda Abreu em pose de ballet ao ar livre",
  },
  {
    type: "image",
    src: "/images/fernanda-v2-3.png",
    alt: "Fernanda Abreu em movimento em casa",
  },
  {
    type: "image",
    src: "/images/fernanda-v2-4.png",
    alt: "Fernanda Abreu em exercício de flexibilidade",
  },
  {
    type: "image",
    src: "/images/fernanda-v2-5.png",
    alt: "Fernanda Abreu em pose de ballet fitness no chão",
  },
];

function slideKey(slide: Slide, index: number) {
  return `${slide.type}-${slide.src}-${index}`;
}

const VIDEO_START_SECONDS = 1;

function seekVideoToStart(video: HTMLVideoElement) {
  if (video.duration && video.duration <= VIDEO_START_SECONDS) return;
  video.currentTime = VIDEO_START_SECONDS;
}

export function PhotoCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const current = slides[index];
  const isVideo = current.type === "video";

  function prev() {
    setIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
  }

  function next() {
    setIndex((i) => (i === slides.length - 1 ? 0 : i + 1));
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo) return;
    video.pause();

    if (video.readyState >= 1) {
      seekVideoToStart(video);
      return;
    }

    function onLoaded() {
      const el = videoRef.current;
      if (el) seekVideoToStart(el);
    }

    video.addEventListener("loadedmetadata", onLoaded);
    return () => video.removeEventListener("loadedmetadata", onLoaded);
  }, [index, isVideo]);

  useEffect(() => {
    if (paused || isVideo) return;

    const timer = window.setInterval(() => {
      setIndex((i) => (i === slides.length - 1 ? 0 : i + 1));
    }, 5200);

    return () => window.clearInterval(timer);
  }, [paused, index, isVideo]);

  return (
    <div
      className="relative mx-auto aspect-[9/16] w-full max-w-[20rem] overflow-hidden rounded-[2rem] bg-[var(--accent-soft)] sm:max-w-[22rem] md:max-w-none lg:max-w-[26rem]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={slideKey(current, index)}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        >
          {current.type === "image" ? (
            <Image
              src={current.src}
              alt={current.alt}
              fill
              className="object-cover object-center"
              sizes="(min-width: 1024px) 26rem, (min-width: 640px) 22rem, 20rem"
              priority={index === 1}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#1a1418]">
              <video
                ref={videoRef}
                src={current.src}
                className="max-h-full max-w-full object-contain"
                controls
                playsInline
                preload="metadata"
                aria-label={current.alt}
                onLoadedMetadata={(event) => seekVideoToStart(event.currentTarget)}
                onPlay={() => setPaused(true)}
                onEnded={(event) => seekVideoToStart(event.currentTarget)}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {!isVideo && (
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      )}

      <button
        type="button"
        onClick={prev}
        className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--accent)] transition hover:opacity-90 sm:left-4 sm:h-10 sm:w-10"
        aria-label="Anterior"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--accent)] transition hover:opacity-90 sm:right-4 sm:h-10 sm:w-10"
        aria-label="Próximo"
      >
        ›
      </button>

      <div
        className={`absolute left-1/2 z-10 flex -translate-x-1/2 gap-2 ${
          isVideo ? "bottom-3" : "bottom-4"
        }`}
      >
        {slides.map((slide, i) => (
          <button
            key={slideKey(slide, i)}
            type="button"
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all duration-500 ${
              i === index ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
            aria-label={
              slide.type === "video"
                ? `Ir para vídeo (${i + 1} de ${slides.length})`
                : `Ir para foto ${i + 1} de ${slides.length}`
            }
          />
        ))}
      </div>
    </div>
  );
}
