import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite 프로젝트 설정 파일입니다.
// React 플러그인을 사용하여 JSX 및 최신 React 기능을 원활하게 실행합니다.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
});
