/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // KNWshare theme palette (dynamic theme tokens)
        knw: {
          bg:          'var(--background)',
          surface:     'var(--surface)',
          card:        'var(--card)',
          cardHover:   'var(--card-hover)',
          red:         'rgb(var(--primary-rgb) / <alpha-value>)',
          redBright:   'rgb(var(--primary-hover-rgb) / <alpha-value>)',
          redDark:     'rgb(var(--primary-dark-rgb) / <alpha-value>)',
          redDeep:     'rgb(var(--primary-deep-rgb) / <alpha-value>)',
          redGlow:     'var(--primary-glow)',
          border:      'var(--border)',
          borderSoft:  'var(--border)',
          neon:        'rgb(var(--accent-rgb) / <alpha-value>)',
          neonGlow:    'var(--accent-glow)',
          white:       'var(--text)',
          offWhite:    'var(--text)',
          muted:       'var(--muted-text)',
          subtle:      'var(--muted-text)',
        },
        primary: {
          DEFAULT:     'rgb(var(--primary-rgb) / <alpha-value>)',
          hover:       'rgb(var(--primary-hover-rgb) / <alpha-value>)',
          dark:        'rgb(var(--primary-dark-rgb) / <alpha-value>)',
          deep:        'rgb(var(--primary-deep-rgb) / <alpha-value>)',
          soft:        'var(--primary-soft)',
          glow:        'var(--primary-glow)',
        },
        accent: {
          DEFAULT:     'rgb(var(--accent-rgb) / <alpha-value>)',
          soft:        'var(--accent-soft)',
          glow:        'var(--accent-glow)',
        },
        // brand palette for existing and legacy components
        brand: {
          500:         'rgb(var(--primary-rgb) / <alpha-value>)',
          600:         'rgb(var(--primary-dark-rgb) / <alpha-value>)',
          700:         'rgb(var(--primary-deep-rgb) / <alpha-value>)',
          50:          'var(--primary-soft-bg)',
          100:         'var(--primary-soft)',
          900:         'var(--background)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'soft':      '0 2px 15px -3px rgba(0,0,0,0.5), 0 10px 20px -2px rgba(0,0,0,0.3)',
        'soft-lg':   '0 10px 25px -3px rgba(0,0,0,0.6)',
        'red':       '0 0 20px -4px var(--shadow-primary)',
        'red-lg':    '0 0 40px -8px var(--shadow-primary-lg)',
        'neon':      '0 0 15px var(--accent-glow), 0 0 30px var(--primary-glow)',
        'card':      '0 4px 24px var(--shadow-color)',
      },
      animation: {
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'slide-in':   'slide-in 0.3s ease-out',
        'ring-live':  'ring-live 1.5s ease-in-out infinite',
      },
      keyframes: {
        'neon-pulse': {
          '0%,100%': { boxShadow: '0 0 5px var(--shadow-primary), 0 0 10px var(--primary-glow)' },
          '50%':     { boxShadow: '0 0 20px var(--shadow-primary), 0 0 40px var(--shadow-primary-lg)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'ring-live': {
          '0%,100%': { boxShadow: '0 0 0 2px var(--primary)' },
          '50%':     { boxShadow: '0 0 0 5px var(--primary-glow)' },
        },
      },
    },
  },
  plugins: [],
}
