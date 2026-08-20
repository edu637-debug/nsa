/**
 * ==============================================================================
 * 파일명: src/components/IssueDetail.jsx
 * 설명: 시사 이슈 상세 보기 전체 래퍼 컴포넌트
 * 기능:
 *  1) 뒤로가기 및 카테고리 빵부스러기(Breadcrumb) 네비게이션
 *  2) 쟁점 배경 설명 및 알기 쉬운 용어 사전
 *  3) 찬성 vs 반대 3줄 논거 비교 및 객관적 팩트체크
 *  4) 실시간 생각 투표 및 클린 틴즈 토론 게시판 통합
 * ==============================================================================
 */

import React from 'react';
import { 
  ArrowLeft, 
  Bookmark, 
  Share2, 
  Tag, 
  HelpCircle, 
  Scale, 
  Sparkles,
  Info
} from 'lucide-react';
import BalanceCard from './BalanceCard.jsx';
import GlossaryTooltip from './GlossaryTooltip.jsx';
import VoteSection from './VoteSection.jsx';
import DebateBoard from './DebateBoard.jsx';

export default function IssueDetail({
  issue,
  onBack,
  userVote,
  onVote,
  onAddComment,
  onReaction,
  bookmarks,
  onToggleBookmark,
  onSelectKeyword
}) {
  if (!issue) return null;

  const isBookmarked = bookmarks.includes(issue.id);

  // 링크 공유 기능
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `[유스밸런스] ${issue.title}`,
        text: issue.summary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('이슈 링크가 클립보드에 복사되었습니다!');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-16 animate-fadeIn">
      
      {/* 1. 상단 네비게이션 바 & 액션 버튼 */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm border border-slate-200 dark:border-slate-700 transition-all shadow-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>전체 이슈 목록으로</span>
        </button>

        <div className="flex items-center gap-2">
          {/* 북마크 버튼 */}
          <button
            onClick={() => onToggleBookmark(issue.id)}
            className={`p-2.5 rounded-xl border transition-all ${
              isBookmarked
                ? 'bg-amber-50 text-amber-600 border-amber-300 dark:bg-amber-950/50 dark:border-amber-700'
                : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
            title={isBookmarked ? '관심 이슈에서 제거' : '관심 이슈로 저장'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
          </button>

          {/* 공유 버튼 */}
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            title="이슈 공유하기"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. 이슈 헤더 섹션 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950">
            {issue.categoryName}
          </span>
          <span className="text-xs text-slate-400">
            시사 이슈 밸런스 브리핑
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-3">
          {issue.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium mb-5 leading-relaxed">
          {issue.subtitle}
        </p>

        {/* 연관 키워드 태그들 */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Tag className="w-3.5 h-3.5 text-slate-400" />
          {issue.keywords.map((kw) => (
            <button
              key={kw}
              onClick={() => onSelectKeyword(kw)}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 dark:bg-slate-800 dark:hover:bg-emerald-950 dark:text-slate-300 dark:hover:text-emerald-300 transition-colors"
            >
              {kw}
            </button>
          ))}
        </div>

        {/* 이슈 배경 설명 (Background Box) */}
        <div className="bg-slate-100/80 dark:bg-slate-800/60 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
            <Info className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>왜 이 이슈가 사회적 화두가 되었을까요?</span>
          </h3>
          <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            {issue.background}
          </p>
        </div>
      </div>

      {/* 3. 청소년 쉬운 용어 사전 */}
      <GlossaryTooltip glossary={issue.glossary} />

      {/* 4. 찬성 vs 반대 3줄 핵심 논거 대칭 카드 & 객관적 팩트체크 */}
      <BalanceCard issue={issue} />

      {/* 5. 실시간 생각 투표 */}
      <VoteSection
        issue={issue}
        userVote={userVote}
        onVote={onVote}
      />

      {/* 6. 클린 틴즈 토론 게시판 */}
      <DebateBoard
        issue={issue}
        onAddComment={onAddComment}
        onReaction={onReaction}
      />

    </div>
  );
}
