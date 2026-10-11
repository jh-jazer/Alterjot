import React, { useState } from 'react';

interface BookCoverProps {
  title: string;
  author?: string;
  genre?: string;
  coverImage?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

// Unified timeless clothbound book cover palette for all manuscripts
const UNIFIED_COVER_PALETTE = {
  bg: 'bg-gradient-to-br from-[#26211c] via-[#1c1815] to-[#120f0d]',
  border: 'border-amber-400/35',
  accent: 'text-amber-300/85',
  text: 'text-[#fef3c7]',
};

export const BookCover: React.FC<BookCoverProps> = ({
  title,
  author,
  genre = '',
  coverImage,
  size = 'md',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const palette = UNIFIED_COVER_PALETTE;

  // Sizing definitions
  const sizeClasses = {
    xs: 'w-16 aspect-[2/3] text-[9px]',
    sm: 'w-20 sm:w-22 aspect-[2/3] text-[10px]',
    md: 'w-24 sm:w-28 aspect-[2/3] text-xs',
    lg: 'w-32 sm:w-40 aspect-[2/3] text-sm',
  };

  const hasValidImage = Boolean(coverImage && !imageError);

  return (
    <div
      className={`relative aspect-[2/3] select-none rounded-r-lg rounded-l-xs overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 flex-shrink-0 ${
        sizeClasses[size]
      } ${className}`}
      title={`${title}${author ? ` by ${author}` : ''}`}
    >
      {/* 3D Sewn Book Spine Crease on Left Edge */}
      <div className="absolute left-0 top-0 bottom-0 w-2.5 sm:w-3 bg-gradient-to-r from-black/60 via-white/10 to-transparent z-20 pointer-events-none rounded-l-xs" />

      {/* 3D Book Page Edge Shadow on Right Edge */}
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-l from-black/35 to-transparent z-20 pointer-events-none" />

      {/* Top & Bottom hardback edge sheen */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20 z-20 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-black/40 z-20 pointer-events-none" />

      {hasValidImage ? (
        <img
          src={coverImage}
          alt={`${title} Book Cover`}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover rounded-r-lg rounded-l-xs group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        /* Default Classic Clothbound Hardcover with Title Inside */
        <div
          className={`w-full h-full ${palette.bg} text-white p-2 sm:p-2.5 flex flex-col justify-between relative overflow-hidden`}
        >
          {/* Subtle tactile radial grain reflection */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />

          {/* Embossed gold/fillet frame */}
          <div
            className={`w-full h-full border ${palette.border} rounded-sm p-1.5 sm:p-2 flex flex-col justify-between items-center text-center relative z-10`}
          >
            {/* Top ornament / genre marker */}
            <div className="w-full flex items-center justify-center gap-1 pt-0.5">
              <span className={`text-[8px] sm:text-[9px] font-mono uppercase tracking-widest ${palette.accent} font-semibold truncate`}>
                {genre ? genre.toUpperCase() : 'ALTERJOT'}
              </span>
            </div>

            {/* Center: Title Inside Book Cover */}
            <div className="my-auto px-0.5 w-full">
              <h4
                className={`font-serif font-bold ${palette.text} tracking-tight leading-snug line-clamp-3 drop-shadow-xs ${
                  size === 'xs'
                    ? 'text-[10px]'
                    : size === 'sm'
                    ? 'text-[11px]'
                    : size === 'md'
                    ? 'text-xs sm:text-[13px]'
                    : 'text-sm sm:text-base'
                }`}
              >
                {title}
              </h4>

              {/* Decorative flourish */}
              <div className="w-6 h-[1px] bg-amber-300/40 mx-auto my-1.5" />
            </div>

            {/* Bottom: Author Name Inside Cover */}
            <div className="w-full pb-0.5">
              <p
                className={`text-[8px] sm:text-[9px] font-mono uppercase tracking-wider ${palette.accent} opacity-85 truncate`}
              >
                {author || 'ANONYMOUS'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
