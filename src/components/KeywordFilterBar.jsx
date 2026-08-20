/**
 * ==============================================================================
 * 파일명: src/components/KeywordFilterBar.jsx
 * 설명: 원클릭 빠른 이슈 탐색을 위한 인기 키워드 해시태그 바 컴포넌트
 * 기능:
 *  1) 인기 시사 키워드 버튼 목록 제공
 *  2) 키워드 클릭 시 해당 이슈 즉시 필터링 토글
 *  3) 선택된 키워드 강조 및 초기화 버튼
 * ==============================================================================
 */

import React from 'react';
import { Tag, X, Flame } from 'lucide-react';

export default function KeywordFilterBar({
  keywords,
  selectedKeyword,
  onSelectKeyword,
  onClearKeyword
}) {
  return (
    <div className="w-full mb-6 bg-slate-100/80 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-700/50">
      
      {/* 상단 라벨 및 초기화 버튼 */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
          <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
          <span>청소년 HOT 키워드로 1초 만에 찾기</span>
        </div>

        {selectedKeyword && (
          <button
            onClick={onClearKeyword}
            className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 font-medium hover:underline"
          >
            <X className="w-3.5 h-3.5" />
            <span>키워드 필터 해제</span>
          </button>
        )}
      </div>

      {/* 키워드 태그 목록 (클릭 시 토글) */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {keywords.map((kw) => {
          const isSelected = selectedKeyword === kw;
          return (
            <button
              key={kw}
              onClick={() => onSelectKeyword(isSelected ? '' : kw)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                isSelected
                  ? 'bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-400 scale-105'
                  : 'bg-white hover:bg-emerald-50 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 border border-slate-200/80 dark:border-slate-600'
              }`}
            >
              <Tag className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
              <span>{kw}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
