import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles } from 'lucide-react';

interface BookCoverProps {
  title: string;
  author?: string;
  genre?: string;
  coverImage?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  badge?: 'wattpad' | 'alterjot' | 'featured' | string;
}

export const BookCover: React.FC<BookCoverProps> = ({
  title,
  author,
  genre = '',
  coverImage,
  size = 'md',
  className = '',
  badge,
}) => {
  const [imageError, setImageError] = useState(false);

  // Wattpad-standard 2:3 vertical poster proportions
  const sizeClasses = {
    xs: 'w-14 sm:w-16 aspect-[2/3] text-[9px]',
    sm: 'w-20 sm:w-24 aspect-[2/3] text-[10px]',
    md: 'w-28 sm:w-32 aspect-[2/3] text-xs',
    lg: 'w-36 sm:w-44 aspect-[2/3] text-sm',
    xl: 'w-48 sm:w-56 aspect-[2/3] text-base',
    full: 'w-full h-full aspect-[2/3] text-sm',
  };

  const hasValidImage = Boolean(coverImage && !imageError);

  return (
    <div
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      className={`relative select-none rounded-none overflow-hidden border border-black/15 dark:border-white/10 shadow-sm group-hover:shadow-xl transition-all duration-300 flex-shrink-0 bg-neutral-900 ${
        sizeClasses[size]
      } ${className}`}
      style={{
        userSelect: 'none',
        WebkitUserDrag: 'none',
      } as React.CSSProperties}
      title={`${title}${author ? ` by ${author}` : ''}`}
    >
      {/* Optional Wattpad / Alterjot Orange Accent Badge */}
      {badge && (
        <div className="absolute top-0 left-0 z-20 bg-gradient-to-br from-[#ff6100] to-[#e64a00] text-white font-extrabold text-[10px] sm:text-[11px] px-2 py-0.5 rounded-none shadow-md flex items-center justify-center tracking-tight leading-none pointer-events-none select-none">
          {badge === 'wattpad' ? (
            <span className="font-black italic">W</span>
          ) : badge === 'alterjot' ? (
            <span className="font-serif font-black">A</span>
          ) : (
            <span>{badge}</span>
          )}
        </div>
      )}
      {hasValidImage ? (
        /* Wattpad Full-Bleed Cover Image Presentation */
        <div className="w-full h-full relative overflow-hidden group select-none pointer-events-none">
          <img
            src={coverImage}
            alt={`${title} Cover`}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover rounded-none group-hover:scale-105 transition-transform duration-300 pointer-events-none select-none"
            style={{
              WebkitUserDrag: 'none',
              userSelect: 'none',
              pointerEvents: 'none',
            } as React.CSSProperties}
          />
          {/* Subtle bottom vignette to frame image */}
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        </div>
      ) : (
        /* Wattpad-Style Clean Image Holder Placeholder */
        <div className="w-full h-full relative flex flex-col justify-between p-2 sm:p-2.5 bg-gradient-to-b from-[#2b2723] via-[#1c1916] to-[#12100e] text-white overflow-hidden">
          {/* Subtle soft ambient light reflection */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Top: Genre marker or Wattpad tag */}
          <div className="relative z-10 flex items-center justify-between gap-1 w-full pt-0.5">
            <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-amber-400/90 font-semibold truncate">
              {genre ? genre.toUpperCase() : 'STORY'}
            </span>
            <Sparkles className="w-2.5 h-2.5 text-amber-400/60 flex-shrink-0" />
          </div>

          {/* Center: Modern Image Holder Icon & Frame */}
          <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-1">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-none bg-white/5 border border-dashed border-white/20 flex flex-col items-center justify-center text-white/60 mb-1 shadow-inner group-hover:border-amber-400/50 group-hover:text-amber-300 transition-colors">
              <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-[8px] sm:text-[9px] font-mono tracking-wider text-white/40 uppercase font-medium">
              Cover Holder
            </span>
          </div>

          {/* Bottom: Book Title & Author overlay */}
          <div className="relative z-10 w-full pt-1 pb-0.5 space-y-0.5">
            <h4
              className={`font-serif font-bold text-white tracking-tight leading-tight line-clamp-2 drop-shadow-sm ${
                size === 'xs'
                  ? 'text-[9px]'
                  : size === 'sm'
                  ? 'text-[11px]'
                  : size === 'md'
                  ? 'text-xs sm:text-[13px]'
                  : size === 'full'
                  ? 'text-[11px] sm:text-xs'
                  : 'text-sm sm:text-base'
              }`}
            >
              {title}
            </h4>
            <p className="text-[8px] sm:text-[9px] font-sans text-white/60 truncate font-medium">
              {author || 'Anonymous'}
            </p>
          </div>

          {/* Soft contrast ramp for bottom typography */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none z-0" />
        </div>
      )}
    </div>
  );
};
