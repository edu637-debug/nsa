/**
 * ==============================================================================
 * 파일명: src/components/IssueList.jsx
 * 설명: 필터링 및 검색된 시사 이슈 카드 목록 그리드 컴포넌트
 * 기능:
 *  1) 이슈별 밸런스 미니 차트 게이지 표시
 *  2) 카테고리 및 키워드 태그 바로가기
 *  3) 북마크(관심 이슈 저장) 토글
 *  4) 결과 없음(Empty State) 시 초기화 안내
 * ==============================================================================
 */

import React from 'react';
import { 
  Bookmark, 
  MessageSquare, 
  Vote, 
  ArrowRight, 
  Sparkles, 
  Scale, 
  TrendingUp, 
  Landmark, 
  GraduationCap, 
  Leaf, 
  Users 
} from 'lucide-react';

const CATEGORY_ICONS = {
  law: Scale,
  economy: TrendingUp,
  politics: Landmark,
  education: GraduationCap,
  environment: Leaf,
  society: Users,
};

const CATEGORY_COLORS = {
  law: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  economy: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  politics: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  education: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  environment: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border-teal-200 dark:border-teal-800',
  society: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800',
};

export default function IssueList({
  issues,
  onSelectIssue,
  bookmarks,
  onToggleBookmark,
  onSelectKeyword,
  onResetFilters
}) {
  // 결과가 없을 때의 Empty State UI
  if (issues.length === 0) {
    return (
      <div className="w-full py-16 px-4 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
          조건에 맞는 시사 이슈를 찾을 수 없습니다
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
          검색어 철자를 확인하시거나, 선택된 카테고리/키워드 필터를 해제해 보세요.
        </p>
        <button
          onClick={onResetFilters}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-emerald-500/20"
        >
          모든 필터 초기화하고 전체 이슈 보기
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {issues.map((issue) => {
        const IconComponent = CATEGORY_ICONS[issue.category] || Sparkles;
        const colorClass = CATEGORY_COLORS[issue.category] || CATEGORY_COLORS.law;
        const isBookmarked = bookmarks.includes(issue.id);

        // 투표 비율 계산 (찬성, 반대, 중립)
        const totalVotes = (issue.initialVotes?.pro || 0) + (issue.initialVotes?.con || 0) + (issue.initialVotes?.neutral || 0) || 1;
        const proPercent = Math.round(((issue.initialVotes?.pro || 0) / totalVotes) * 100);
        const conPercent = Math.round(((issue.initialVotes?.con || 0) / totalVotes) * 100);
        const neutralPercent = 100 - proPercent - conPercent;

        const commentCount = issue.initialComments?.length || 0;

        return (
          <div
            key={issue.id}
            className="group relative flex flex-col bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-300 overflow-hidden"
          >
            {/* 카드 상단: 카테고리 뱃지 & 북마크 */}
            <div className="p-5 pb-3 flex items-center justify-between">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${colorClass}`}>
                <IconComponent className="w-3.5 h-3.5" />
                <span>{issue.categoryName}</span>
              </span>

              {/* 북마크 버튼 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(issue.id);
                }}
                className={`p-2 rounded-full transition-colors ${
                  isBookmarked
                    ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                title={isBookmarked ? '관심 이슈에서 제거' : '관심 이슈로 저장'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
              </button>
            </div>

            {/* 카드 본문: 제목 및 설명 (클릭 시 상세 이동) */}
            <div 
              onClick={() => onSelectIssue(issue)}
              className="px-5 flex-1 cursor-pointer"
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 mb-2 leading-snug">
                {issue.title}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-3 line-clamp-1">
                {issue.subtitle}
              </p>

              <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
                {issue.summary}
              </p>

              {/* 미니 밸런스 비율 게이지 바 */}
              <div className="mb-4 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400">찬성 {proPercent}%</span>
                  <span className="text-slate-400">중립 {neutralPercent}%</span>
                  <span className="text-rose-600 dark:text-rose-400">반대 {conPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
                  <div style={{ width: `${proPercent}%` }} className="bg-emerald-500 h-full transition-all duration-500" />
                  <div style={{ width: `${neutralPercent}%` }} className="bg-slate-400 h-full transition-all duration-500" />
                  <div style={{ width: `${conPercent}%` }} className="bg-rose-500 h-full transition-all duration-500" />
                </div>
              </div>
            </div>

            {/* 카드 하단: 키워드 태그 및 메타 통계 */}
            <div className="px-5 pb-5 pt-1 mt-auto border-t border-slate-100 dark:border-slate-700/50 flex flex-col gap-3">
              {/* 키워드 태그 리스트 */}
              <div className="flex flex-wrap gap-1.5">
                {issue.keywords.slice(0, 3).map((kw) => (
                  <button
                    key={kw}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectKeyword(kw);
                    }}
                    className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 dark:bg-slate-700/60 dark:hover:bg-emerald-950 dark:text-slate-300 dark:hover:text-emerald-300 transition-colors"
                  >
                    {kw}
                  </button>
                ))}
              </div>

              {/* 참여 현황 & 바로가기 버튼 */}
              <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-medium">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Vote className="w-3.5 h-3.5 text-slate-400" />
                    <span>{totalVotes}명 참여</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span>{commentCount}개 의견</span>
                  </span>
                </div>

                <button
                  onClick={() => onSelectIssue(issue)}
                  className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform"
                >
                  <span>비교하기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
