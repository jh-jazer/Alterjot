import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import vampireSiegeBanner from '../../assets/vampire_siege_banner.jpg';
import elevatorDeliveryBanner from '../../assets/elevator_delivery_banner.jpg';
import { ArrowRight } from 'lucide-react';

interface SlideItem {
  id: string;
  challengeId: string;
  badge: string;
  universe: string;
  title: string;
  description?: string;
  elements?: {
    time: string;
    character: string;
    location: string;
  };
  image: string;
  alt: string;
}

interface ChallengesSectionProps {
  showPlaygroundLink?: boolean;
  className?: string;
}

export const ChallengesSection: React.FC<ChallengesSectionProps> = ({
  showPlaygroundLink: _showPlaygroundLink = true,
  className = '',
}) => {
  const navigate = useNavigate();
  const openChallenge = useWorkspaceStore((s) => s.openChallenge);
  const preferredTheme = useWorkspaceStore((s) => s.preferredTheme);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const pointerStartXRef = useRef<number | null>(null);
  const pointerStartTimeRef = useRef<number>(0);
  const dragDeltaXRef = useRef<number>(0);
  const hasDraggedRef = useRef<boolean>(false);
  const isAnimatingRef = useRef<boolean>(false);

  const slides: SlideItem[] = [
    {
      id: 'world',
      challengeId:
        preferredTheme === 'cyberpunk'
          ? 'cyberpunk-world'
          : preferredTheme === 'dark-fantasy'
          ? 'dark-fantasy-world'
          : preferredTheme === 'steampunk'
          ? 'steampunk-world'
          : 'apocalyptic-world',
      badge: 'World Challenge',
      universe: 'The Last Bastion • Midnight Siege',
      title: 'Phantom of Their Nightmares',
      description:
        'By night, the streets belong entirely to the infected—pale, predatory vampires who swarm out of the dark to besiege his fortified house, clawing at the barricades while he waits out the siege inside with whiskey, blaring music, and fresh wooden stakes. It is an inversion of nature where humanity is extinct, the monsters are the dominant society, and the last surviving man has become the phantom of their nightmares.',
      image: vampireSiegeBanner,
      alt: 'World Challenge: Phantom of Their Nightmares',
    },
    {
      id: 'triad',
      challengeId:
        preferredTheme === 'cyberpunk'
          ? 'cyberpunk-triad'
          : preferredTheme === 'dark-fantasy'
          ? 'dark-fantasy-triad'
          : preferredTheme === 'steampunk'
          ? 'steampunk-triad'
          : 'apocalyptic-triad',
      badge: 'Three Elements',
      universe: 'Floor 43 Ascent • Outbreak Day 1',
      title: 'The 43rd Floor Delivery',
      elements: {
        time: 'Day 1 of the zombie apocalypse.',
        character: 'An Asian delivery guy in uniform, holding a food bag and his phone,',
        location: 'Inside a rising elevator, passing the 30th floor on its way to the 43rd floor.',
      },
      image: elevatorDeliveryBanner,
      alt: 'Three Elements Challenge: The 43rd Floor Delivery',
    },
  ];

  // Slide transition animation helper
  const finishSlide = useCallback(
    (direction: 'next' | 'prev') => {
      if (!trackRef.current || isAnimatingRef.current) return;
      isAnimatingRef.current = true;

      const targetTransform =
        direction === 'next' ? 'translateX(-66.666666%)' : 'translateX(0%)';
      trackRef.current.style.transition =
        'transform 380ms cubic-bezier(0.16, 1, 0.3, 1)';
      trackRef.current.style.transform = targetTransform;

      setTimeout(() => {
        if (!trackRef.current) {
          isAnimatingRef.current = false;
          return;
        }
        trackRef.current.style.transition = 'none';
        if (direction === 'next') {
          setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
        } else {
          setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
        }
        trackRef.current.style.transform = 'translateX(-33.333333%)';
        isAnimatingRef.current = false;
      }, 380);
    },
    [slides.length]
  );

  // Auto-advance slideshow every 6 seconds, pausing on hover or while dragging
  useEffect(() => {
    if (isHovered || isDragging) return;
    const interval = setInterval(() => {
      finishSlide('next');
    }, 6000);
    return () => clearInterval(interval);
  }, [isHovered, isDragging, finishSlide]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 || isAnimatingRef.current) return;
    pointerStartXRef.current = e.clientX;
    pointerStartTimeRef.current = Date.now();
    dragDeltaXRef.current = 0;
    hasDraggedRef.current = false;
    setIsDragging(true);

    if (trackRef.current) {
      trackRef.current.style.transition = 'none';
    }

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (pointerStartXRef.current === null) return;
    const deltaX = e.clientX - pointerStartXRef.current;
    dragDeltaXRef.current = deltaX;

    if (Math.abs(deltaX) > 6) {
      hasDraggedRef.current = true;
    }

    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(calc(-33.333333% + ${deltaX}px))`;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    try {
      if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      }
    } catch {
      // safe fallback
    }

    if (pointerStartXRef.current === null) return;

    const deltaX = dragDeltaXRef.current;
    const timeElapsed = Date.now() - pointerStartTimeRef.current;
    pointerStartXRef.current = null;
    dragDeltaXRef.current = 0;
    setIsDragging(false);

    // Fast flick (> 25px in < 280ms) OR standard drag distance (> 60px)
    const isFastFlick = timeElapsed < 280 && Math.abs(deltaX) > 25;
    const isFarDrag = Math.abs(deltaX) > 60;

    if (isFastFlick || isFarDrag) {
      if (deltaX < 0) {
        finishSlide('next');
      } else {
        finishSlide('prev');
      }
    } else {
      // Snap back smoothly to center
      if (trackRef.current) {
        trackRef.current.style.transition =
          'transform 260ms cubic-bezier(0.16, 1, 0.3, 1)';
        trackRef.current.style.transform = 'translateX(-33.333333%)';
      }
    }

    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 120);
  };

  const handlePointerCancel = () => {
    pointerStartXRef.current = null;
    dragDeltaXRef.current = 0;
    setIsDragging(false);
    if (trackRef.current) {
      trackRef.current.style.transition =
        'transform 260ms cubic-bezier(0.16, 1, 0.3, 1)';
      trackRef.current.style.transform = 'translateX(-33.333333%)';
    }
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 120);
  };

  // 3-panel circular window: [prev, current, next]
  const prevIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
  const nextIndex = (currentSlideIndex + 1) % slides.length;
  const visibleSlides = [
    { ...slides[prevIndex], slot: 'prev' },
    { ...slides[currentSlideIndex], slot: 'current' },
    { ...slides[nextIndex], slot: 'next' },
  ];

  return (
    <section className={`w-full ${className}`}>
      {/* Panoramic Banner Slideshow Card — True Real-Time Draggable, Full Width */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onClick={() => {
          if (hasDraggedRef.current || isDragging) return;
          const cid = slides[currentSlideIndex].challengeId;
          openChallenge(cid);
          navigate(`/challenge/${cid}`);
        }}
        className={`w-full relative rounded-none overflow-hidden shadow-none border-b border-canvas-border hover:border-brand-500/40 transition-all duration-300 group select-none bg-stone-950 touch-pan-y ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <div className="relative w-full h-[360px] sm:h-[420px] md:h-[480px] overflow-hidden">
          {/* Real-time Draggable 3-Panel Track */}
          <div
            ref={trackRef}
            className="flex h-full w-[300%] select-none will-change-transform"
            style={{ transform: 'translateX(-33.333333%)' }}
          >
            {visibleSlides.map((slide, slotIdx) => (
              <div
                key={`${slotIdx}-${slide.id}`}
                className="relative w-1/3 h-full overflow-hidden flex-shrink-0"
              >
                {/* Background Image */}
                <img
                  src={slide.image}
                  alt={slide.alt}
                  draggable={false}
                  className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out pointer-events-none select-none"
                />

                {/* Ambient Lighting Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/85 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-transparent to-black/40 pointer-events-none" />

                {/* LOWERED CONTENT: BIG CHALLENGE TYPE HEADING, TITLE SUBTEXT, DESCRIPTION & JOIN CTA */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:px-12 md:py-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-none z-10">
                  <div className="space-y-2 max-w-xl sm:max-w-2xl pl-1 sm:pl-2">
                    {/* Big Challenge Type Heading (World Challenge / Three Elements) */}
                    <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black text-white tracking-tight drop-shadow-xl leading-none">
                      {slide.badge}
                    </h2>

                    {/* Challenge Name as Subtext */}
                    <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap pt-0.5">
                      <span className="text-base sm:text-xl md:text-2xl font-serif font-bold text-amber-300 drop-shadow-md">
                        {slide.title}
                      </span>
                      <span className="text-xs font-mono text-white/75 hidden sm:inline">
                        • {slide.universe}
                      </span>
                    </div>

                    {/* Elements Breakdown into One Continuous Highlighted Paragraph */}
                    {slide.elements ? (
                      <p className="text-xs sm:text-sm text-neutral-100 font-serif drop-shadow-md max-w-2xl leading-relaxed sm:leading-loose">
                        <span className="box-decoration-clone bg-amber-400/20 text-amber-100 border border-amber-400/40 px-1.5 py-0.5 rounded-none mr-1.5 inline">
                          {slide.elements.time}
                        </span>{' '}
                        <span className="box-decoration-clone bg-cyan-400/20 text-cyan-100 border border-cyan-400/40 px-1.5 py-0.5 rounded-none mr-1.5 inline">
                          {slide.elements.character}
                        </span>{' '}
                        <span className="box-decoration-clone bg-rose-400/20 text-rose-100 border border-rose-400/40 px-1.5 py-0.5 rounded-none inline">
                          {slide.elements.location}
                        </span>
                      </p>
                    ) : (
                      <p className="text-xs sm:text-sm text-neutral-200 font-serif line-clamp-3 sm:line-clamp-4 drop-shadow-md leading-relaxed">
                        {slide.description}
                      </p>
                    )}

                    {/* CTA Action Button directly below description */}
                    <div className="pointer-events-auto pt-1 sm:pt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (hasDraggedRef.current) return;
                          openChallenge(slide.challengeId);
                          navigate(`/challenge/${slide.challengeId}`);
                        }}
                        className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-none bg-amber-500 hover:bg-amber-400 text-stone-950 font-serif font-extrabold text-xs sm:text-sm shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider"
                      >
                        <span className="sm:hidden">Join</span>
                        <span className="hidden sm:inline">Join Challenge</span>
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* TOP-LEFT PANEL HEADER: WRITING CHALLENGE (INSIDE PANEL) */}
          <div className="absolute top-0 left-0 p-4 sm:p-6 md:px-12 md:py-8 z-20 pointer-events-none flex items-center">
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 bg-black/60 backdrop-blur-md border border-white/15 rounded-none shadow-sm">
              <div className="w-0.5 h-3 bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
              <h2 className="text-xs sm:text-sm font-serif font-bold tracking-widest uppercase text-stone-100 drop-shadow-sm">
                Writing Challenge
              </h2>
            </div>
          </div>

          {/* TOP-RIGHT CONTROLS: INDICATOR DOTS & PLAYGROUND LINK (PINNED OVERLAY) */}
          <div className="absolute top-0 right-0 p-4 sm:p-6 md:px-12 md:py-8 flex items-center gap-2 sm:gap-3 z-20 pointer-events-auto">
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 border border-white/15 rounded-none shadow-sm">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (idx === currentSlideIndex) return;
                    if (idx === (currentSlideIndex + 1) % slides.length) {
                      finishSlide('next');
                    } else {
                      finishSlide('prev');
                    }
                  }}
                  className={`h-1.5 rounded-none transition-all duration-300 cursor-pointer ${
                    currentSlideIndex === idx
                      ? 'w-6 sm:w-8 bg-amber-400'
                      : 'w-2 sm:w-2.5 bg-white/30 hover:bg-white/60'
                  }`}
                  title={`Switch to ${s.title}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

