import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F9F8F6',
        ink: {
          DEFAULT: '#1A1917',
          light: '#2E2D29',
          muted: '#615E57',
          faint: '#8F8B82',
        },
        sand: {
          50: '#FAF9F6',
          100: '#F4F1EA',
          200: '#EAE5D9',
          300: '#DED7C8',
          400: '#C7BEAD',
          500: '#9E9482',
          border: '#E2DCD2',
        },
        moss: {
          DEFAULT: '#2D3A29',
          light: '#3D4D37',
          dark: '#1E271B',
          soft: '#EAF0E8',
          muted: '#52664C',
        },
        terracotta: {
          DEFAULT: '#B85333',
          light: '#CD6A4A',
          dark: '#943F24',
          soft: '#F8ECE8',
        },
        stone: {
          50: '#F7F6F4',
          100: '#EDEBE6',
          200: '#DCD9D0',
          300: '#BBB6AA',
          500: '#757064',
          800: '#383630',
        },
        // Compatibilidad retroactiva suave con paleta ecológica
        'neoterra-dark': '#181715',
        'neoterra-navy': '#22211E',
        'neoterra-cyan': '#2D3A29',
        'neoterra-purple': '#4D3B4F',
        'neoterra-gold': '#B85333',
        'neoterra-red': '#A83B2C',
        'neoterra-green': '#2D3A29',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        orbitron: ['var(--font-serif)', 'Georgia', 'serif'],
        inter: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '2px',
        md: '4px',
        lg: '6px',
        xl: '8px',
        '2xl': '12px',
      },
      borderWidth: {
        DEFAULT: '1px',
        hairline: '0.5px',
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(26, 25, 23, 0.04)',
        paper: '0 4px 20px -2px rgba(26, 25, 23, 0.05)',
        elevated: '0 12px 32px -4px rgba(26, 25, 23, 0.08)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
