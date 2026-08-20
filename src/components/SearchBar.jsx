/**
 * ==============================================================================
 * 파일명: src/components/SearchBar.jsx
 * 설명: 실시간 스마트 통합 검색창 컴포넌트
 * 기능:
 *  1) 제목, 키워드, 본문 내용 실시간 검색어 입력 처리
 *  2) 원클릭 검색어 지우기 (X 버튼)
 *  3) 검색 결과 건수 피드백 제공
 * ==============================================================================
 */

import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  resultCount,
  totalCount
}) {
  return (
    <div className="w-full mb-5">
      <div className="relative flex items-center">
        {/* 검색 아이콘 */}
        <div className="absolute left-4 pointer-events-none text-slate-400 dark:text-slate-500">
          <Search className="w-5 h-5" />
        </div>

        {/* 검색 입력창 */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="궁금한 시사 이슈나 키워드를 검색해보세요 (예: 촉법소년, 기본소득, AI, 수능, 탄소세 등)"
          className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />

        {/* 검색어 지우기 버튼 */}
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="검색어 지우기"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 검색 결과 카운트 안내 */}
      {searchQuery && (
        <div className="mt-2 px-2 text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>
            '<strong>{searchQuery}</strong>' 검색 결과: <strong className="text-emerald-600 dark:text-emerald-400">{resultCount}</strong>개
          </span>
          <button
            onClick={() => setSearchQuery('')}
            className="text-slate-400 hover:underline"
          >
            전체 {totalCount}개 보기
          </button>
        </div>
      )}
    </div>
  );
}
