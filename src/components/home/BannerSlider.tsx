'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { getStoredSlides, BannerSlide, DEFAULT_SLIDES } from '@/lib/banner-config';
import { handleImageError } from '@/lib/image-compressor';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export function BannerSlider() {
  const [slides, setSlides] = useState<BannerSlide[]>(DEFAULT_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch & Drag Swipe State
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const isDragging = useRef<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load slides from storage & listen for live updates
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

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  // Calmer 6.5s auto-play timer (pauses when touching or hovering)
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    timerRef.current = setInterval(() => {
      goToNext();
    }, 6500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, slides.length, goToNext]);

  // Touch Swipe Handlers (Mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 40;
    const isRightSwipe = distance < -40;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Mouse Drag Handlers (Desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    touchStartX.current = e.clientX;
    touchEndX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    touchEndX.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (touchStartX.current && touchEndX.current) {
      const distance = touchStartX.current - touchEndX.current;
      if (distance > 40) goToNext();
      if (distance < -40) goToPrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!slides || slides.length === 0) return null;

  return (
    <section className="py-2.5 sm:py-4">
      <div className="container-main">
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            isDragging.current = false;
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="group relative w-full h-[180px] sm:h-[260px] md:h-[340px] lg:h-[400px] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden border border-[#EBE6DF] shadow-xs select-none cursor-grab active:cursor-grabbing bg-[#FAFAF8]"
        >
          {/* ═══ Horizontal Sliding Track (Real Flipkart / Myntra Sliding) ═══ */}
          <div
            className="flex w-full h-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {slides.map((slide, idx) => (
              <div
                key={slide.id || idx}
                className="w-full h-full shrink-0 relative overflow-hidden"
              >
                <Link
                  href={slide.linkUrl || '/shop'}
                  className="block w-full h-full relative"
                  onClick={(e) => {
                    // Prevent accidental navigation during touch swipe
                    if (touchStartX.current && touchEndX.current && Math.abs(touchStartX.current - touchEndX.current) > 10) {
                      e.preventDefault();
                    }
                  }}
                >
                  <img
                    src={slide.imageUrl}
                    alt={slide.title || `Ciraaya Banner ${idx + 1}`}
                    onError={handleImageError}
                    className="w-full h-full object-cover object-center pointer-events-none"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />

                  {/* Clean, Human-Crafted Editorial Campaign Badge */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 pointer-events-none">
                    <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#EBE6DF] shadow-xs flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#C5A059]" />
                      <span className="text-[9px] sm:text-[10px] font-bold text-[#18181B] tracking-wider uppercase">
                        {slide.badge || 'Curated Everyday Luxury'}
                      </span>
                    </div>
                  </div>

                  {/* Subtle Gradient Shadow for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 pointer-events-none" />
                </Link>
              </div>
            ))}
          </div>

          {/* ═══ Left Navigation Button (Always visible on mobile & desktop) ═══ */}
          {slides.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToPrev();
              }}
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-[#18181B] shadow-sm border border-[#EBE6DF] flex items-center justify-center transition-all duration-200 z-20 cursor-pointer"
              aria-label="Previous banner"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* ═══ Right Navigation Button (Always visible on mobile & desktop) ═══ */}
          {slides.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-[#18181B] shadow-sm border border-[#EBE6DF] flex items-center justify-center transition-all duration-200 z-20 cursor-pointer"
              aria-label="Next banner"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* ═══ Bottom Pagination Indicators ═══ */}
          {slides.length > 1 && (
            <div className="absolute bottom-2.5 sm:bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-[#EBE6DF]/80 shadow-2xs">
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
                    h-1 rounded-full transition-all duration-300 cursor-pointer
                    ${idx === currentIndex ? 'w-5 bg-[#C5A059]' : 'w-1 bg-[#A1A1AA]/60 hover:bg-[#71717A]'}
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
