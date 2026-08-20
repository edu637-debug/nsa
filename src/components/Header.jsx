/**
 * ==============================================================================
 * 파일명: src/components/Header.jsx
 * 설명: 유스밸런스 플랫폼의 상단 글로벌 헤더 컴포넌트
 * 기능:
 *  1) 로고 클릭 시 메인 홈으로 리셋 이동
 *  2) 다크모드/라이트모드 실시간 테마 전환
 *  3) 플랫폼 소개 모달 및 건전 토론 가이드 모달 호출 버튼
 *  4) 북마크(관심 이슈) 모아보기 토글
 * ==============================================================================
 */

import React from 'react';
import { Scale, Moon, Sun, Bookmark, HelpCircle, ShieldCheck } from 'lucide-react';

export default function Header({
  isDarkMode,
  setIsDarkMode,
  onGoHome,
  onOpenAbout,
  onOpenGuide,
  showBookmarksOnly,
  setShowBookmarksOnly,
  bookmarkCount
}) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* 1. 브랜드 로고 및 플랫폼 명 */}
        <div 
          onClick={onGoHome}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                유스밸런스
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                YouthBalance
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              청소년을 위한 시사·사회 이슈 객관화 플랫폼
            </p>
          </div>
        </div>

        {/* 2. 우측 글로벌 액션 버튼들 */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* 북마크 모아보기 토글 버튼 */}
          <button
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              showBookmarksOnly
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300'
            }`}
            title="내가 저장한 관심 이슈 모아보기"
          >
            <Bookmark className={`w-4 h-4 ${showBookmarksOnly ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span className="hidden md:inline">저장한 이슈</span>
            {bookmarkCount > 0 && (
              <span className="w-5 h-5 text-xs rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">
                {bookmarkCount}
              </span>
            )}
          </button>

          {/* 클린 토론 가이드 버튼 */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="청소년 건전 토론 가이드"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden lg:inline">토론 가이드</span>
          </button>

          {/* 플랫폼 소개 모달 버튼 */}
          <button
            onClick={onOpenAbout}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="유스밸런스 플랫폼 소개"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* 다크모드 / 라이트모드 토글 스위치 */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDarkMode ? '라이트 모드로 변경' : '다크 모드로 변경'}
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

        </div>

      </div>
    </header>
  );
}
