/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 背景色
        'canvas-bg': '#F8F7F5',
        // 对话气泡颜色
        'bubble-left': '#E8EAF6',
        'bubble-right': '#F5F1E8',
        // 阴影色
        'shadow-left': '#D1D9E6',
        'shadow-right': '#E8DFC8',
        // 文字色
        'text-primary': '#333333',
        'text-secondary': '#666666',
        // 边框色
        'border-light': '#E5E5E5',
      },
      borderRadius: {
        'bubble': '12px',
      },
      boxShadow: {
        'bubble-left': 'inset 0 1px 4px 0 #D1D9E6',
        'bubble-right': 'inset 0 1px 4px 0 #E8DFC8',
      },
      fontSize: {
        'dialogue': ['16px', { lineHeight: '1.6' }],
      },
      spacing: {
        'canvas-w': '1440px',
        'canvas-h': '1920px',
        'safe': '80px',
        'block-gap': '24px',
      }
    },
  },
  plugins: [],
}
