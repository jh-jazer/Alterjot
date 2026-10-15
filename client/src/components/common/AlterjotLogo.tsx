import React from 'react';

export interface AlterjotLogoProps {
  /**
   * 'full': Icon emblem + 'alterjot' wordmark
   * 'icon': Just the fountain pen alpha emblem
   * 'text': Just the 'alterjot' wordmark
   */
  variant?: 'full' | 'icon' | 'text';
  /**
   * Predefined size presets or custom sizing
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Optional custom className for the container
   */
  className?: string;
  /**
   * Whether to display the glowing light ember at the nib tip
   * Defaults to true
   */
  showGlow?: boolean;
  /**
   * Override color mode for 'alter':
   * 'auto' adapts to light/dark mode via text-ink
   * 'light' forces white/cream text (for dark headers or hero banners)
   * 'dark' forces charcoal/black text (for light paper backgrounds)
   */
  textMode?: 'auto' | 'light' | 'dark';
}

/**
 * High-fidelity Alterjot Icon Emblem SVG
 * Faithfully represents the glowing alpha-loop fountain pen from the Alterjot branding.
 */
export const AlterjotIcon: React.FC<{
  size?: number | string;
  className?: string;
  showGlow?: boolean;
}> = ({ size = 32, className = '', showGlow = true }) => {
  const [useFallback, setUseFallback] = React.useState(false);
  const uniqueId = React.useId().replace(/:/g, '');

  if (!useFallback) {
    return (
      <img
        src="/apple-touch-icon.png"
        alt="Alterjot"
        width={size}
        height={size}
        onError={() => setUseFallback(true)}
        className={`select-none flex-shrink-0 object-contain hover:scale-105 transition-transform duration-200 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none flex-shrink-0 ${className}`}
      style={{ overflow: 'visible' }}
      aria-label="Alterjot Logo Icon"
    >
      <defs>
        {/* Main 3D Warm Orange/Amber Body Gradient */}
        <linearGradient
          id={`emblemGrad-${uniqueId}`}
          x1="18%"
          y1="8%"
          x2="82%"
          y2="92%"
        >
          <stop offset="0%" stopColor="#ff9a3d" />
          <stop offset="28%" stopColor="#ff6b00" />
          <stop offset="65%" stopColor="#e54e00" />
          <stop offset="100%" stopColor="#8f2400" />
        </linearGradient>

        {/* Satin Lighting Highlight Overlay */}
        <linearGradient
          id={`highlightGrad-${uniqueId}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="30%" stopColor="#ffb84d" stopOpacity="0.2" />
          <stop offset="70%" stopColor="#000000" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
        </linearGradient>

        {/* Fountain Pen Nib Metallic Gradient */}
        <linearGradient
          id={`nibGrad-${uniqueId}`}
          x1="30%"
          y1="20%"
          x2="85%"
          y2="80%"
        >
          <stop offset="0%" stopColor="#ffb03a" />
          <stop offset="35%" stopColor="#ea580c" />
          <stop offset="80%" stopColor="#9a3412" />
          <stop offset="100%" stopColor="#5c1a05" />
        </linearGradient>

        {/* Chevron Caret Gradient */}
        <linearGradient
          id={`chevronGrad-${uniqueId}`}
          x1="50%"
          y1="0%"
          x2="50%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#fff8e7" />
          <stop offset="50%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>

        {/* Glowing Nib Tip Radial Flare */}
        <radialGradient
          id={`sparkGlow-${uniqueId}`}
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop offset="0%" stopColor="#fff8db" stopOpacity="1" />
          <stop offset="20%" stopColor="#fde047" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.4" />
          <stop offset="80%" stopColor="#ea580c" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
        </radialGradient>

        {/* Soft Ambient Ember Drop Shadow */}
        <filter
          id={`emblemShadow-${uniqueId}`}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="3.5"
            floodColor="#ea580c"
            floodOpacity="0.4"
          />
        </filter>
      </defs>

      {/* Main Group with Ambient Warm Shadow */}
      <g filter={`url(#emblemShadow-${uniqueId})`}>
        {/* ======================================================== */}
        {/* 1. LOWER RIGHT LEG / SPUR of 'a' / 'α'                   */}
        {/* ======================================================== */}
        <path
          d="M 52 64 L 62 76.5 L 67.5 76.5 L 57 60 Z"
          fill={`url(#emblemGrad-${uniqueId})`}
        />

        {/* ======================================================== */}
        {/* 2. THE MAIN CIRCULAR ALPHA LOOP + DIAGONAL STEM          */}
        {/* ======================================================== */}
        <path
          d="
            M 36 28
            C 21.6 28, 10 39.6, 10 54
            C 10 68.4, 21.6 80, 36 80
            C 44.5 80, 52 75.8, 56.5 69.5
            L 70 44
            C 67.5 38, 62 33, 54 29.5
            C 49 28.5, 42.5 28, 36 28
            Z
            M 36 41
            C 43.2 41, 49 46.8, 49 54
            C 49 61.2, 43.2 67, 36 67
            C 28.8 67, 23 61.2, 23 54
            C 23 46.8, 28.8 41, 36 41
            Z
          "
          fill={`url(#emblemGrad-${uniqueId})`}
          fillRule="evenodd"
        />

        {/* Bevel highlight along outer contour */}
        <path
          d="
            M 11.5 54
            C 11.5 40.5, 22.5 29.5, 36 29.5
            C 48 29.5, 58 35, 64 42
            L 68.5 36.5
          "
          stroke={`url(#highlightGrad-${uniqueId})`}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />

        {/* ======================================================== */}
        {/* 3. INNER CHEVRON / CARET SYMBOL (The 'A' Crossbar / Nib) */}
        {/* ======================================================== */}
        <path
          d="M 30.5 59 L 36 48 L 41.5 59"
          stroke={`url(#chevronGrad-${uniqueId})`}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* ======================================================== */}
        {/* 4. PEN BARREL EXTENSION & COLLAR BAND                   */}
        {/* ======================================================== */}
        {/* Diagonal Barrel from loop top to collar */}
        <path
          d="M 54.5 49 L 68 33.5 L 75 40 L 59.5 56.5 Z"
          fill={`url(#emblemGrad-${uniqueId})`}
        />

        {/* Metallic Collar Separation Ring */}
        <path
          d="M 67 32.5 L 76 41"
          stroke="#fed7aa"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* ======================================================== */}
        {/* 5. FOUNTAIN PEN NIB                                      */}
        {/* Classic pointed nib flaring at shoulders and tapering   */}
        {/* ======================================================== */}
        <path
          d="
            M 68 31.5
            L 70.5 24
            C 72.5 21, 77 17.5, 84 13.5
            C 80 20.5, 80 24.5, 82.5 27
            L 75 39.5
            Z
          "
          fill={`url(#nibGrad-${uniqueId})`}
        />

        {/* Nib Breather Hole */}
        <circle
          cx="76"
          cy="23"
          r="1.6"
          fill="#1c1917"
          stroke="#fde047"
          strokeWidth="0.8"
        />

        {/* Nib Slit Line from breather hole to tip */}
        <line
          x1="76"
          y1="23"
          x2="84"
          y2="13.5"
          stroke="#1c1917"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <line
          x1="76"
          y1="23"
          x2="83.8"
          y2="13.7"
          stroke="#fed7aa"
          strokeWidth="0.5"
          strokeLinecap="round"
          opacity="0.8"
        />
      </g>

      {/* ======================================================== */}
      {/* 6. GLOWING EMBER / RADIANT SPARK AT THE NIB TIP          */}
      {/* ======================================================== */}
      {showGlow && (
        <g>
          {/* Broad outer warmth */}
          <circle
            cx="84"
            cy="13.5"
            r="13"
            fill={`url(#sparkGlow-${uniqueId})`}
            className="animate-pulse"
            style={{ animationDuration: '3s' }}
          />
          {/* Intense radiant golden core */}
          <circle
            cx="84"
            cy="13.5"
            r="3.2"
            fill="#fde047"
            filter="drop-shadow(0 0 4px #fbbf24)"
          />
          {/* Incandescent white center point */}
          <circle cx="84" cy="13.5" r="1.5" fill="#ffffff" />
        </g>
      )}
    </svg>
  );
};

/**
 * Alterjot Brand Logo Component
 * Combines the Alpha-Pen Emblem with the modern 'alterjot' wordmark.
 */
export const AlterjotLogo: React.FC<AlterjotLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showGlow = true,
  textMode = 'auto',
}) => {
  // Sizing matrix for emblem and typography
  const sizeConfig = {
    xs: { iconSize: 20, textSize: 'text-sm', dotSize: 'w-1 h-1', gap: 'gap-1.5' },
    sm: { iconSize: 24, textSize: 'text-base', dotSize: 'w-1.2 h-1.2', gap: 'gap-2' },
    md: { iconSize: 32, textSize: 'text-xl', dotSize: 'w-1.5 h-1.5', gap: 'gap-2.5' },
    lg: { iconSize: 42, textSize: 'text-2xl sm:text-3xl', dotSize: 'w-2 h-2', gap: 'gap-3' },
    xl: { iconSize: 56, textSize: 'text-4xl sm:text-5xl', dotSize: 'w-2.5 h-2.5', gap: 'gap-4' },
  };

  const { iconSize, textSize, dotSize, gap } = sizeConfig[size] || sizeConfig.md;

  // Text color determination for 'alter'
  const alterTextColor =
    textMode === 'light'
      ? 'text-white'
      : textMode === 'dark'
      ? 'text-neutral-900'
      : 'text-ink'; // adapts automatically with light/dark theme

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <AlterjotIcon size={iconSize} showGlow={showGlow} />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${gap} select-none ${className}`}>
      {/* 1. Fountain Pen Alpha Emblem */}
      {variant !== 'text' && (
        <AlterjotIcon size={iconSize} showGlow={showGlow} />
      )}

      {/* 2. 'alterjot' Styled Wordmark */}
      <div className={`flex items-baseline font-sans font-bold tracking-tight ${textSize} leading-none`}>
        {/* 'alter' prefix */}
        <span className={`${alterTextColor} transition-colors duration-200`}>
          alter
        </span>

        {/* Glowing Warm Transition Dot beneath the baseline between 'r' and 'j' */}
        <span
          className={`inline-block ${dotSize} rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 shadow-[0_0_6px_rgba(251,191,36,0.9)] mx-[1px] translate-y-[2px] flex-shrink-0`}
          title="Alterjot Inspiration Spark"
        />

        {/* 'jot' suffix in vibrant warm orange gradient */}
        <span
          className="bg-gradient-to-r from-[#ff7700] via-[#f95700] to-[#e64600] bg-clip-text text-transparent font-black"
          style={{
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          jot
        </span>
      </div>
    </div>
  );
};
