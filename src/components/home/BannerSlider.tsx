'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getStoredSlides, BannerSlide, DEFAULT_SLIDES } from '@/lib/banner-config';
import { handleImageError } from '@/lib/image-compressor';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function BannerSlider() {
  const [slides, setSlides] = useState<BannerSlide[]>(DEFAULT_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load slides from storage & listen for live admin updates
  useEffect(() => {
    setSlides(getStoredSlides());

    const handleUpdate = () => {
      setSlides(getStoredSlides());
    };

    window.addEventListener('ciraaya-slides-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('ciraaya-slides-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Auto-play timer (slides every 4.5s unless hovered)
  useEffect(() => {
    if (isHovered || slides.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, slides.length, currentIndex]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <section className="py-3 sm:py-5">
      <div className="container-main">
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative w-full h-[190px] sm:h-[280px] md:h-[360px] lg:h-[420px] rounded-2xl md:rounded-3xl overflow-hidden border border-[#EBE6DF] shadow-xs bg-[#FAFAF8]"
        >
          {/* Active Banner Image with Link */}
          <Link
            href={currentSlide.linkUrl || '/shop'}
            className="block w-full h-full relative"
          >
            {slides.map((slide, idx) => (
              <img
                key={slide.id || idx}
                src={slide.imageUrl}
                alt={slide.title || `Ciraaya Banner ${idx + 1}`}
                onError={handleImageError}
                className={`
                  absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out
                  ${idx === currentIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-102 pointer-events-none z-0'}
                `}
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            ))}
          </Link>

          {/* Left Arrow Button */}
          {slides.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white text-[#18181B] shadow-md border border-[#EBE6DF] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Right Arrow Button */}
          {slides.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white text-[#18181B] shadow-md border border-[#EBE6DF] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Bottom Timer Slider Dots Indicator */}
          {slides.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/35 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/20">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`
                    h-1.5 rounded-full transition-all duration-300 cursor-pointer
                    ${idx === currentIndex ? 'w-6 bg-[#C5A059]' : 'w-1.5 bg-white/70 hover:bg-white'}
                  `}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
