/**
 * ==============================================================================
 * 파일명: src/components/VoteSection.jsx
 * 설명: 실시간 청소년 생각 투표 및 통계 시각화 게이지 컴포넌트
 * 기능:
 *  1) 찬성(Pro) / 반대(Con) / 신중·중립(Neutral) 3지선다 투표
 *  2) 투표 참여 시 실시간 백분율 및 인터랙티브 밸런스 게이지 시각화
 *  3) 사용자의 선택 상태 보존 및 변경 지원
 * ==============================================================================
 */

import React, { useState } from 'react';
import { Vote, CheckCircle2, RotateCcw, ThumbsUp, ThumbsDown, HelpCircle, Users } from 'lucide-react';
import { generateSHA256Hash } from '../utils/security.js';

export default function VoteSection({
  issue,
  userVote,
  onVote
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 투표 총합 및 백분율 계산
  const votes = issue.initialVotes || { pro: 0, con: 0, neutral: 0 };
  const totalVotes = (votes.pro || 0) + (votes.con || 0) + (votes.neutral || 0);

  const proPercent = totalVotes > 0 ? Math.round((votes.pro / totalVotes) * 100) : 0;
  const conPercent = totalVotes > 0 ? Math.round((votes.con / totalVotes) * 100) : 0;
  const neutralPercent = totalVotes > 0 ? Math.max(0, 100 - proPercent - conPercent) : 0;

  // 투표 핸들러 (SHA-256 보안 해시 생성 후 전달)
  const handleVoteClick = async (voteType) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 기기 식별 및 타임스탬프 기반 익명 보안 토큰 생성
      const rawToken = `${navigator.userAgent}_${issue.id}_${Date.now()}`;
      const tokenHash = await generateSHA256Hash(rawToken);

      onVote(issue.id, voteType, tokenHash);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
      
      {/* 1. 상단 타이틀 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Vote className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              실시간 청소년 생각 투표
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              양측의 입장을 모두 읽어보셨나요? 당신의 솔직한 생각을 남겨주세요.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold self-start sm:self-auto">
          <Users className="w-3.5 h-3.5" />
          <span>총 <strong>{totalVotes.toLocaleString()}</strong>명 참여 중</span>
        </div>
      </div>

      {/* 2. 투표 버튼 그룹 (찬성 / 중립 / 반대) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8">
        
        {/* 찬성 버튼 */}
        <button
          onClick={() => handleVoteClick('pro')}
          disabled={isSubmitting}
          className={`flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl border-2 transition-all ${
            userVote?.voteType === 'pro'
              ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30 scale-102 ring-4 ring-emerald-300 dark:ring-emerald-900'
              : 'bg-emerald-50/50 hover:bg-emerald-100/70 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-2">
            <ThumbsUp className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-base mb-0.5">찬성합니다</span>
          <span className="text-xs opacity-80">도입/시행에 동의</span>
          {userVote?.voteType === 'pro' && (
            <span className="mt-2 text-xs font-bold px-2 py-0.5 rounded-full bg-white text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 내 선택
            </span>
          )}
        </button>

        {/* 중립/보류 버튼 */}
        <button
          onClick={() => handleVoteClick('neutral')}
          disabled={isSubmitting}
          className={`flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl border-2 transition-all ${
            userVote?.voteType === 'neutral'
              ? 'bg-slate-700 text-white border-slate-700 shadow-lg shadow-slate-700/30 scale-102 ring-4 ring-slate-400 dark:ring-slate-600'
              : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-900/70 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-2">
            <HelpCircle className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-base mb-0.5">신중·중립</span>
          <span className="text-xs opacity-80">추가 논의 및 보완 필요</span>
          {userVote?.voteType === 'neutral' && (
            <span className="mt-2 text-xs font-bold px-2 py-0.5 rounded-full bg-white text-slate-800 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 내 선택
            </span>
          )}
        </button>

        {/* 반대 버튼 */}
        <button
          onClick={() => handleVoteClick('con')}
          disabled={isSubmitting}
          className={`flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl border-2 transition-all ${
            userVote?.voteType === 'con'
              ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/30 scale-102 ring-4 ring-rose-300 dark:ring-rose-900'
              : 'bg-rose-50/50 hover:bg-rose-100/70 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-300'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-2">
            <ThumbsDown className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-base mb-0.5">반대합니다</span>
          <span className="text-xs opacity-80">도입/시행에 반대</span>
          {userVote?.voteType === 'con' && (
            <span className="mt-2 text-xs font-bold px-2 py-0.5 rounded-full bg-white text-rose-700 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 내 선택
            </span>
          )}
        </button>

      </div>

      {/* 3. 실시간 인터랙티브 밸런스 게이지 바 */}
      <div className="bg-slate-50 dark:bg-slate-900/70 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
        
        <div className="flex justify-between items-center text-sm font-extrabold mb-2.5">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>찬성 {proPercent}% ({votes.pro}명)</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span>중립 {neutralPercent}% ({votes.neutral}명)</span>
          </div>

          <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>반대 {conPercent}% ({votes.con}명)</span>
          </div>
        </div>

        {/* 프로그레스 바 게이지 */}
        <div className="w-full h-4 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex shadow-inner">
          <div 
            style={{ width: `${proPercent}%` }} 
            className="bg-emerald-500 h-full transition-all duration-700 relative group"
            title={`찬성: ${proPercent}%`}
          />
          <div 
            style={{ width: `${neutralPercent}%` }} 
            className="bg-slate-400 h-full transition-all duration-700 relative group"
            title={`중립: ${neutralPercent}%`}
          />
          <div 
            style={{ width: `${conPercent}%` }} 
            className="bg-rose-500 h-full transition-all duration-700 relative group"
            title={`반대: ${conPercent}%`}
          />
        </div>

        <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">
          * 유스밸런스는 청소년의 자율적이고 비편향적인 의견 형성을 위해 실시간으로 투표 결과를 투명하게 집계합니다.
        </p>

      </div>

    </div>
  );
}
