/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Sora"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        cosmic: {
          950: '#030712',
          900: '#070b14',
          850: '#0b101d',
          800: '#111827',
          750: '#172033',
          700: '#1e293b',
          600: '#334155',
        },
        electric: {
          indigo: '#6366f1',
          violet: '#8b5cf6',
          cyan: '#06b6d4',
          emerald: '#10b981',
          amber: '#f59e0b',
          coral: '#f43f5e',
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        risk: {
          low: '#10b981',
          medium: '#f59e0b',
          high: '#f43f5e',
        }
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(99, 102, 241, 0.25)',
        'glow-md': '0 0 25px -4px rgba(99, 102, 241, 0.35)',
        'neon-violet': '0 0 25px -4px rgba(139, 92, 246, 0.45)',
        'neon-cyan': '0 0 25px -4px rgba(6, 182, 212, 0.45)',
        'neon-emerald': '0 0 25px -4px rgba(16, 185, 129, 0.45)',
        'neon-amber': '0 0 25px -4px rgba(245, 158, 11, 0.45)',
        'neon-coral': '0 0 25px -4px rgba(244, 63, 94, 0.45)',
        'glass-elevated': '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)',
        'inner-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        aurora: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        }
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        aurora: 'aurora 12s ease infinite',
      }
    },
  },
  plugins: [],
}

