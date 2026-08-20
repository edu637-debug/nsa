/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 다크모드 지원 ('class' 방식)
  theme: {
    extend: {
      colors: {
        // 청소년 친화적인 균형과 활력의 브랜드 컬러
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // 찬성/균형 메인 그린
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // 찬성(Pro) 및 반대(Con) 테마 컬러
        pro: {
          light: '#ecfdf5',
          DEFAULT: '#10b981',
          dark: '#047857',
        },
        con: {
          light: '#fef2f2',
          DEFAULT: '#ef4444',
          dark: '#b91c1c',
        },
        neutralSide: {
          light: '#f8fafc',
          DEFAULT: '#64748b',
          dark: '#334155',
        }
      },
      fontFamily: {
        sans: ['Pretendard', 'Noto Sans KR', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
