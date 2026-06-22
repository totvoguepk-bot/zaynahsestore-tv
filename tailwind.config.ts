import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body:    ['var(--font-body)', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#16a34a',
          hover:   '#15803d',
          light:   '#dcfce7',
          text:    '#ffffff',
        },
        secondary: {
          DEFAULT: '#1a1a2e',
          hover:   '#16213e',
          text:    '#ffffff',
        },
        accent: {
          DEFAULT: '#e94560',
          hover:   '#c73652',
          light:   '#fce7eb',
        },
        surface: {
          DEFAULT: '#ffffff',
          2:       '#f8f8f8',
          3:       '#f1f1f1',
        },
        muted: {
          DEFAULT: '#6b7280',
          light:   '#9ca3af',
        },
        border: {
          DEFAULT: '#e5e7eb',
          dark:    '#d1d5db',
        },
        success: '#10b981',
        warning: '#f59e0b',
        error:   '#ef4444',
        whatsapp:'#25D366',
      },
      borderRadius: {
        btn:   '12px',
        card:  '16px',
        modal: '20px',
        badge: '9999px',
      },
      boxShadow: {
        card:  '0 2px 12px rgba(0,0,0,0.06)',
        card2: '0 4px 24px rgba(0,0,0,0.10)',
        btn:   '0 2px 8px rgba(22,163,74,0.25)',
      },
    }
  },
  plugins: [],
};

export default config;
