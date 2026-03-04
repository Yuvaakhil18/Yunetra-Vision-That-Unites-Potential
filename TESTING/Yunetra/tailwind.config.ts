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
        // Surface scale
        base:     '#000000',
        subtle:   '#080808',
        muted:    '#0f0f0f',
        card:     '#111111',
        elevated: '#161616',

        // Brand
        primary:  '#38bdf8',
        accent:   '#6366f1',

        // Semantic
        success:  '#00d4aa',
        warning:  '#f59e0b',
        danger:   '#f43f5e',
        prize:    '#f59e0b',

        // Text
        't1':     '#f1f5f9',
        't2':     '#94a3b8',
        't3':     '#475569',
        't4':     '#334155',

        // Legacy aliases (keep for gradual migration)
        bg: '#000000',
        surface: '#080808',
        surface2: '#111111',
        'accent-green': '#38bdf8',
        'accent-purple': '#6366f1',
        'accent-yellow': '#f59e0b',
        'accent-red': '#f43f5e',
        text: '#f1f5f9',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono:    ['Space Mono', 'monospace'],
        body:    ['DM Sans', 'sans-serif'],
        syne:    ['Syne', 'sans-serif'],
        sans:    ['DM Sans', 'sans-serif'],
      },
      fontSize: {
        'hero': 'clamp(3.5rem, 8vw, 7rem)',
        'display': 'clamp(2.5rem, 5vw, 4rem)',
      },
      letterSpacing: {
        'tightest': '-0.03em',
        'tight':    '-0.01em',
        'widest':   '0.15em',
      },
      borderRadius: {
        'btn': '4px',
        'input': '8px',
        'card': '12px',
        'panel': '16px',
        'modal': '20px',
      },
      boxShadow: {
        'glow':        '0 0 20px rgba(56,189,248,0.2), 0 0 60px rgba(56,189,248,0.1)',
        'glow-accent': '0 0 20px rgba(99,102,241,0.2), 0 0 60px rgba(99,102,241,0.1)',
        'glow-sm':     '0 0 15px rgba(56,189,248,0.15)',
        'card':        '0 8px 32px rgba(0,0,0,0.6)',
        'modal':       '0 20px 60px rgba(0,0,0,0.8)',
      },
      backgroundImage: {
        'brand':      'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
        'hero-text':  'linear-gradient(135deg, #f1f5f9 0%, #38bdf8 60%, #6366f1 100%)',
        'card-top':   'linear-gradient(90deg, #38bdf8, #6366f1)',
        'prize':      'linear-gradient(135deg, #f59e0b, #ef4444)',
        'success':    'linear-gradient(135deg, #00d4aa, #38bdf8)',
        'surface':    'linear-gradient(180deg, #080808 0%, #000000 100%)',
      },
      animation: {
        'pulse-dot': 'pulse 2s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float':      'float 6s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(56,189,248,0.2)' },
          '50%':      { boxShadow: '0 0 40px rgba(56,189,248,0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
