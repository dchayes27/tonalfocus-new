'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Photo } from '@/lib/types';

interface FilmstripBannerProps {
  photos: Photo[];
  introLine?: string;
}

export default function FilmstripBanner({ photos, introLine }: FilmstripBannerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const filmstripRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Only run horizontal scroll logic on desktop and when we have photos
    if (isMobile || !scrollContainerRef.current || !filmstripRef.current || photos.length === 0) return;

    const scrollContainer = scrollContainerRef.current;
    const filmstrip = filmstripRef.current;

    // Calculate scroll distance
    let scrollDistance = filmstrip.scrollWidth - window.innerWidth;

    const handleResize = () => {
      scrollDistance = filmstrip.scrollWidth - window.innerWidth;
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollContainerTop = scrollContainer.offsetTop;
      const scrollProgressRaw = scrollTop - scrollContainerTop;
      const containerScrollHeight = scrollContainer.offsetHeight - window.innerHeight;

      if (containerScrollHeight <= 0) return;

      const scrollProgress = Math.max(0, Math.min(1, scrollProgressRaw / containerScrollHeight));

      if (scrollProgress >= 0 && scrollProgress <= 1) {
        const transformX = -scrollProgress * scrollDistance;
        filmstrip.style.transform = `translateX(${transformX}px)`;
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, photos.length]);

  // If no photos, show a placeholder
  if (photos.length === 0) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-primary-beige">
        <div className="text-center p-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-charcoal retro-font mb-4">
            TONAL FOCUS
          </h1>
          <p className="text-lg md:text-xl text-primary-mauve mb-8">
            Film Photography | B&W | Color
          </p>
          <div className="max-w-2xl mx-auto">
            <p className="text-primary-charcoal mb-4">
              Welcome to Tonal Focus Photography. Portfolio images coming soon.
            </p>
            <p className="text-primary-charcoal text-sm">
              Check back shortly as we prepare to showcase our finest work.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      className={isMobile ? '' : 'h-[400vh] relative w-full'}
    >
      <div className={isMobile ? '' : 'sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center'}>
        {/* Header Chip */}
        <div
          className={`${
            isMobile
              ? 'relative pt-10 flex justify-center'
              : 'absolute top-10 left-16'
          } w-full px-8 md:px-0 z-10 pointer-events-none`}
        >
          <span
            className="inline-flex items-center gap-3 rounded-full bg-secondary-offWhite/80 px-4 py-2 text-[11px] uppercase tracking-[0.4em] text-primary-mauve/80 shadow-sm"
            title={introLine ?? undefined}
          >
            <span className="h-px w-12 bg-primary-mauve/40" aria-hidden />
            filmstrip diary
          </span>
        </div>

        {/* Filmstrip */}
        <div
          ref={filmstripRef}
          className={`
            ${isMobile ? 'flex flex-col w-full items-center' : 'flex items-center w-max'}
            ${!isMobile && 'pl-[calc((100vw-760px)/2)]'}
          `}
          style={{ willChange: 'transform' }}
        >
          {photos.map((photo, index) => {
            const imageSrc = photo.public_url || photo.thumbnail_url || '/images/gallery1.jpg';
            const altText = photo.title || `Featured photo ${index + 1}`;

            return (
            <div
              key={photo.id}
              className={`
                relative overflow-hidden
                ${
                  isMobile
                    ? 'w-[70vw] h-[70vw] my-8'
                    : 'w-[min(780px,58vw)] h-[min(68vh,780px)]'
                }
                flex-shrink-0
              `}
            >
              <div className="relative w-full h-full group">
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary-beige/40 via-transparent to-transparent" aria-hidden />
                {/* Film perforation effect - top */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-primary-charcoal z-10 flex justify-around items-center">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-3 h-5 bg-primary-beige rounded-sm" />
                  ))}
                </div>

                {/* Film perforation effect - bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-primary-charcoal z-10 flex justify-around items-center">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-3 h-5 bg-primary-beige rounded-sm" />
                  ))}
                </div>

                {/* Photo */}
                <div className="absolute inset-0 flex items-center justify-center bg-primary-charcoal p-6 lg:p-8">
                  <Image
                    src={imageSrc}
                    alt={altText}
                    width={1200}
                    height={1200}
                    className="w-full h-full object-cover rounded-lg shadow-2xl"
                    priority={index < 3}
                    quality={index === 0 ? 95 : 90}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    sizes="(max-width: 600px) 85vw, (max-width: 1200px) 65vw, 820px"
                  />
                </div>

                {/* Photo number overlay */}
                <div className="absolute bottom-12 right-4 bg-primary-charcoal/80 px-3 py-1 rounded">
                  <span className="text-primary-mauve font-mono text-sm">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
