/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 背景色 - 暖白
        'canvas-bg': '#FAF9F6',
        // 对话气泡颜色 - 雾感
        'bubble-left': 'rgba(240, 242, 244, 0.85)',
        'bubble-right': 'rgba(245, 242, 237, 0.85)',
        // 文字色
        'text-primary': '#2C2C2C',
        'text-secondary': '#666666',
        // 边框色
        'border-light': '#E5E5E5',
      },
      borderRadius: {
        'bubble': '16px',
      },
      fontSize: {
        'dialogue-large': ['18px', { lineHeight: '1.75' }],
        'dialogue-small': ['14px', { lineHeight: '1.75' }],
      },
      fontFamily: {
        'serif': ['"Noto Serif SC"', '"Source Han Serif SC"', '"Source Han Serif CN"', 'serif'],
      },
    },
  },
  plugins: [],
}
