/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: 'var(--bg-canvas)',
          subtle: 'var(--bg-subtle)',
          card: 'var(--bg-card)',
          surface: 'var(--bg-surface)',
          border: 'var(--border-main)',
          hover: 'var(--bg-hover)',
        },
        ink: {
          DEFAULT: 'var(--text-ink)',
          muted: 'var(--text-muted)',
          faint: 'var(--text-faint)',
        },
        brand: {
          50: 'var(--brand-50)',
          100: 'var(--brand-100)',
          200: 'var(--brand-200)',
          300: 'var(--brand-300)',
          400: 'var(--brand-400)',
          500: 'var(--brand-500)',
          600: 'var(--brand-600)',
          700: 'var(--brand-700)',
          800: 'var(--brand-800)',
          900: 'var(--brand-900)',
        },
        codex: {
          char: 'var(--codex-char)',
          loc: 'var(--codex-loc)',
          faction: 'var(--codex-faction)',
          timeline: 'var(--codex-timeline)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Newsreader', 'EB Garamond', 'Merriweather', 'Lora', 'Georgia', 'serif'],
        typewriter: ['Courier Prime', 'ui-monospace', 'monospace'],
        mono: ['JetBrains Mono', 'Courier Prime', 'monospace'],
      },
      boxShadow: {
        'parchment': '0 4px 20px -2px rgba(92, 70, 42, 0.08), 0 2px 6px -1px rgba(92, 70, 42, 0.04)',
        'parchment-lg': '0 10px 30px -4px rgba(92, 70, 42, 0.12), 0 4px 10px -2px rgba(92, 70, 42, 0.06)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: 'var(--text-ink)',
            lineHeight: '1.85',
            fontSize: '1.18rem',
            p: {
              marginBottom: '1.4em',
            },
            h1: {
              color: 'var(--text-ink)',
              fontWeight: '700',
              marginTop: '1.8em',
              marginBottom: '0.8em',
            },
            h2: {
              color: 'var(--text-ink)',
              fontWeight: '600',
              marginTop: '1.6em',
              marginBottom: '0.7em',
            },
            h3: {
              color: 'var(--text-ink)',
              fontWeight: '600',
              marginTop: '1.4em',
              marginBottom: '0.6em',
            },
            blockquote: {
              borderLeftColor: 'var(--brand-600)',
              borderLeftWidth: '3px',
              paddingLeft: '1.25rem',
              fontStyle: 'italic',
              color: 'var(--text-muted)',
            },
            hr: {
              borderColor: 'var(--border-main)',
              marginTop: '2.5rem',
              marginBottom: '2.5rem',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
