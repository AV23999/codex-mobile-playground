import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        foreground: 'var(--color-text)',
        border: 'var(--color-border)',
        accent: {
          nova: 'var(--nova-cyan)',
          abyssPurple: 'var(--nova-purple)',
          abyssRed: 'var(--nova-magenta)',
          gold: 'var(--nova-gold)',
        },
      },
      borderRadius: { sm: '6px', md: '10px', lg: '12px', xl: '16px' },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
      minHeight: { touch: '44px' },
      minWidth: { touch: '44px' },
    },
  },
};

export default config;
