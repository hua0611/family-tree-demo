import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        webtrees: {
          // 深綠主色（向下相容既有 5 token）
          primary: '#2d5a3d',
          'primary-dark': '#1e3d28',
          'primary-light': '#4a7a5a',

          // 背景
          surface: '#f5f1e8',
          'surface-alt': '#ebe5d4',

          // 卡片
          card: '#ffffff',
          'card-border': '#d4c9b0',

          // 強調（向下相容既有 accent）
          accent: '#8b6f47',
          'accent-light': '#b89968',

          // 文字（向下相容既有 ink / muted）
          ink: '#1f2937',
          muted: '#6b7280',
          faint: '#9ca3af',

          // 分隔線
          divider: '#e5e0ce',

          // 狀態色
          success: '#16a34a',
          danger: '#dc2626',

          // 家族樹節點性別色
          male: '#4a90e2',
          female: '#e07bb0',
          neutral: '#9ca3af',
        },
      },
      fontFamily: {
        sans: ['var(--font-noto-sans-tc)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-noto-serif-tc)', 'Georgia', 'serif'],
        display: ['var(--font-noto-serif-tc)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
