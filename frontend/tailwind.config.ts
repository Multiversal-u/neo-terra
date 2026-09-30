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
        'neoterra-dark': '#050a14',
        'neoterra-navy': '#0a1628',
        'neoterra-cyan': '#00d4ff',
        'neoterra-purple': '#7c3aed',
        'neoterra-gold': '#fbbf24',
        'neoterra-red': '#ef4444',
        'neoterra-green': '#10b981',
      },
      fontFamily: {
        orbitron: ['var(--font-orbitron)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'data-flow': 'data-flow 2s linear infinite',
        'scan-line': 'scan-line 3s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 10px 0px rgba(0, 212, 255, 0.5)' },
          '50%': { opacity: '.5', boxShadow: '0 0 20px 5px rgba(0, 212, 255, 0.8)' },
        },
        'data-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
