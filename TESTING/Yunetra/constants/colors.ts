// Yunetra color constants
// Keep in sync with tokens.css
// Use these ONLY when CSS variables are not accessible
// (Framer Motion values, Canvas API, dynamic calculations)

export const colors = {
  // Surface
  surface: {
    base:     '#000000',
    subtle:   '#080808',
    muted:    '#0f0f0f',
    card:     '#111111',
    elevated: '#161616',
  },

  // Brand
  brand: {
    primary:      '#38bdf8',
    primaryHover: '#0ea5e9',
    primaryDim:   'rgba(56,189,248,0.15)',
    accent:       '#6366f1',
    accentHover:  '#4f46e5',
    accentDim:    'rgba(99,102,241,0.15)',
  },

  // Semantic
  semantic: {
    success: '#00d4aa',
    warning: '#f59e0b',
    danger:  '#f43f5e',
    info:    '#38bdf8',
  },

  // Text
  text: {
    primary:   '#f1f5f9',
    secondary: '#94a3b8',
    tertiary:  '#475569',
    disabled:  '#334155',
    onBrand:   '#000000',
  },

  // Borders
  border: {
    subtle:  'rgba(255,255,255,0.06)',
    default: 'rgba(255,255,255,0.1)',
    strong:  'rgba(255,255,255,0.2)',
    brand:   'rgba(56,189,248,0.3)',
    focus:   'rgba(56,189,248,0.5)',
  },

  // Special
  special: {
    prize:    '#f59e0b',
    credit:   '#38bdf8',
    gold:     '#f59e0b',
    silver:   '#94a3b8',
    bronze:   '#b45309',
  },

  // Session states
  session: {
    pending:   '#f59e0b',
    confirmed: '#38bdf8',
    completed: '#00d4aa',
    cancelled: '#f43f5e',
  },

  // Reputation rings
  rings: {
    skillImpact:    '#38bdf8',
    collaboration:  '#6366f1',
    knowledge:      '#00d4aa',
    reliability:    '#f59e0b',
  },

  // Avatar pool (index by userId % 8)
  avatars: [
    'linear-gradient(135deg, #38bdf8, #6366f1)',
    'linear-gradient(135deg, #6366f1, #f43f5e)',
    'linear-gradient(135deg, #00d4aa, #38bdf8)',
    'linear-gradient(135deg, #f59e0b, #ef4444)',
    'linear-gradient(135deg, #38bdf8, #00d4aa)',
    'linear-gradient(135deg, #a78bfa, #6366f1)',
    'linear-gradient(135deg, #f43f5e, #f59e0b)',
    'linear-gradient(135deg, #6366f1, #38bdf8)',
  ],
} as const

// Helper: get avatar gradient by user ID
export const getAvatarGradient = (userId: string): string => {
  const index = userId.charCodeAt(userId.length - 1) % colors.avatars.length
  return colors.avatars[index]
}

// Helper: get session status color
export const getSessionColor = (status: keyof typeof colors.session): string => {
  return colors.session[status]
}

// Framer Motion variants using tokens
export const motionTokens = {
  cardHover: {
    y: -3,
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  },
  buttonTap: {
    scale: 0.97,
    transition: { type: 'spring', stiffness: 400, damping: 17 }
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  staggerChildren: {
    animate: { transition: { staggerChildren: 0.08 } }
  },
}

export type ColorToken = typeof colors
