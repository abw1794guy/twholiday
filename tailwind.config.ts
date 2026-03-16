import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-noto-sans-tc)', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        strategy: {
          green: '#059669',
          light: '#d1fae5',
        },
      },
    },
  },
  plugins: [],
}
export default config
