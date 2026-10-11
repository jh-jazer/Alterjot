import React, { useState } from 'react';

interface BookCoverProps {
  title: string;
  author?: string;
  genre?: string;
  coverImage?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

// Curated clothbound book colors based on genre
const GENRE_PALETTES: Record<string, { bg: string; border: string; accent: string; text: string }> = {
  steampunk: {
    bg: 'bg-gradient-to-br from-[#4a2618] to-[#2c150c]',
    border: 'border-amber-400/40',
    accent: 'text-amber-300',
    text: 'text-amber-100',
  },
  'cosmic horror': {
    bg: 'bg-gradient-to-br from-[#121936] to-[#0a0d1f]',
    border: 'border-indigo-400/35',
    accent: 'text-indigo-300',
    text: 'text-indigo-100',
  },
  'gothic fantasy': {
    bg: 'bg-gradient-to-br from-[#4c1221] to-[#2a0711]',
    border: 'border-rose-400/40',
    accent: 'text-rose-300',
    text: 'text-rose-100',
  },
  'high fantasy': {
    bg: 'bg-gradient-to-br from-[#123624] to-[#081e13]',
    border: 'border-emerald-400/40',
    accent: 'text-emerald-300',
    text: 'text-emerald-100',
  },
  cyberpunk: {
    bg: 'bg-gradient-to-br from-[#102d3e] to-[#071824]',
    border: 'border-cyan-400/40',
    accent: 'text-cyan-300',
    text: 'text-cyan-100',
  },
  'dark fantasy': {
    bg: 'bg-gradient-to-br from-[#272635] to-[#14131d]',
    border: 'border-amber-400/30',
    accent: 'text-amber-300',
    text: 'text-neutral-100',
  },
  'weird west': {
    bg: 'bg-gradient-to-br from-[#4d3319] to-[#2b1c0d]',
    border: 'border-amber-400/35',
    accent: 'text-amber-300',
    text: 'text-amber-100',
  },
  'space opera': {
    bg: 'bg-gradient-to-br from-[#2f183d] to-[#180a22]',
    border: 'border-fuchsia-400/35',
    accent: 'text-fuchsia-300',
    text: 'text-fuchsia-100',
  },
  mystery: {
    bg: 'bg-gradient-to-br from-[#15343b] to-[#0b1c21]',
    border: 'border-teal-400/35',
    accent: 'text-teal-300',
    text: 'text-teal-100',
  },
  'post-apocalyptic': {
    bg: 'bg-gradient-to-br from-[#3e2716] to-[#221308]',
    border: 'border-amber-500/35',
    accent: 'text-amber-300',
    text: 'text-amber-100',
  },
  default: {
    bg: 'bg-gradient-to-br from-[#1e293b] to-[#0f172a]',
    border: 'border-amber-300/35',
    accent: 'text-amber-300',
    text: 'text-amber-50',
  },
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

  const cleanGenre = (genre || '').toLowerCase().trim();
  const palette =
    GENRE_PALETTES[cleanGenre] ||
    Object.entries(GENRE_PALETTES).find(([k]) => cleanGenre.includes(k))?.[1] ||
    GENRE_PALETTES.default;

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
