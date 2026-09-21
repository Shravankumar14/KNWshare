/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // KNWshare — Black × Red × Neon palette
        knw: {
          bg:          '#080808',
          surface:     '#111111',
          card:        '#181818',
          cardHover:   '#1f1f1f',
          red:         '#E50914',
          redBright:   '#FF1A26',
          redDark:     '#B91C1C',
          redDeep:     '#7F1D1D',
          redGlow:     'rgba(229,9,20,0.25)',
          border:      'rgba(229,9,20,0.2)',
          borderSoft:  'rgba(255,255,255,0.07)',
          neon:        '#FF073A',
          neonGlow:    'rgba(255,7,58,0.4)',
          white:       '#FFFFFF',
          offWhite:    '#E5E5E5',
          muted:       '#A3A3A3',
          subtle:      '#525252',
        },
        // keep brand for any legacy usage
        brand: {
          500: '#E50914', 600: '#B91C1C', 700: '#7F1D1D',
          50: '#1a0000',  100: '#2d0000', 900: '#0A0000',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'soft':      '0 2px 15px -3px rgba(0,0,0,0.5), 0 10px 20px -2px rgba(0,0,0,0.3)',
        'soft-lg':   '0 10px 25px -3px rgba(0,0,0,0.6)',
        'red':       '0 0 20px -4px rgba(229,9,20,0.5)',
        'red-lg':    '0 0 40px -8px rgba(229,9,20,0.4)',
        'neon':      '0 0 15px rgba(255,7,58,0.6), 0 0 30px rgba(255,7,58,0.3)',
        'card':      '0 4px 24px rgba(0,0,0,0.8)',
      },
      animation: {
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'slide-in':   'slide-in 0.3s ease-out',
        'ring-live':  'ring-live 1.5s ease-in-out infinite',
      },
      keyframes: {
        'neon-pulse': {
          '0%,100%': { boxShadow: '0 0 5px rgba(229,9,20,0.5), 0 0 10px rgba(229,9,20,0.3)' },
          '50%':     { boxShadow: '0 0 20px rgba(229,9,20,0.8), 0 0 40px rgba(229,9,20,0.4)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'ring-live': {
          '0%,100%': { boxShadow: '0 0 0 2px rgba(229,9,20,1)' },
          '50%':     { boxShadow: '0 0 0 5px rgba(229,9,20,0.2)' },
        },
      },
    },
  },
  plugins: [],
}
