import type { Config } from 'tailwindcss'

// Design tokens live here and mirror the OKLCH palette declared in
// src/app/globals.css. Update both files together.
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'oklch(98% 0.005 80)',
        ink: {
          DEFAULT: 'oklch(20% 0.02 60)',
          soft: 'oklch(45% 0.015 60)',
          mute: 'oklch(62% 0.012 65)',
        },
        border: {
          DEFAULT: 'oklch(88% 0.01 75)',
          strong: 'oklch(78% 0.012 72)',
        },
        surface: 'oklch(96% 0.008 75)',
        accent: {
          DEFAULT: 'oklch(62% 0.185 34)',
          deep: 'oklch(48% 0.19 32)',
          tint: 'oklch(96% 0.03 40)',
        },
        carbon: {
          DEFAULT: 'oklch(14% 0.015 60)',
          ink: 'oklch(96% 0.005 80)',
          soft: 'oklch(22% 0.018 62)',
          line: 'oklch(30% 0.015 65)',
        },
        hazard: 'oklch(82% 0.14 85)',
        // Legacy brand.* kept for components not yet migrated. Delete
        // when the last reference is gone.
        brand: {
          orange: '#E8512A',
          black: '#1A1A1A',
          bg: '#FAFAFA',
          light: '#FFF3EF',
        },
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Technical labels / eyebrows
        'label': ['0.6875rem', { lineHeight: '1.1', letterSpacing: '0.08em' }],
        // Display scale — tight tracking, tight leading
        'display-sm': ['2.25rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display':    ['3.25rem', { lineHeight: '1.02', letterSpacing: '-0.025em' }],
        'display-lg': ['4.5rem',  { lineHeight: '1.0',  letterSpacing: '-0.03em' }],
        'display-xl': ['6rem',    { lineHeight: '0.98', letterSpacing: '-0.035em' }],
      },
      borderRadius: {
        // Warm but not mushy. Vary by element size so it doesn't feel
        // like the AI-default "everything is 8px" look.
        DEFAULT: '10px',
        xs: '4px',
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px',
        '2xl': '28px',
        pill: '9999px',
      },
      spacing: {
        // 4pt scale — names mirror .impeccable.md
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2.5rem',
        '2xl': '4rem',
        '3xl': '6rem',
        '4xl': '10rem',
      },
      transitionTimingFunction: {
        // The emil curve — default ease for everything non-spring.
        emil: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
      transitionDuration: {
        micro: '180ms',
        base: '260ms',
        slow: '440ms',
      },
      maxWidth: {
        content: '1280px',
      },
      boxShadow: {
        // Warm, low-contrast shadows — no glossy pillow.
        card: '0 1px 2px oklch(20% 0.02 60 / 0.04), 0 8px 24px -12px oklch(20% 0.02 60 / 0.12)',
        'card-hover':
          '0 2px 4px oklch(20% 0.02 60 / 0.06), 0 16px 40px -16px oklch(20% 0.02 60 / 0.18)',
        inset: 'inset 0 1px 0 oklch(100% 0 0 / 0.6)',
      },
    },
  },
  plugins: [],
}

export default config
