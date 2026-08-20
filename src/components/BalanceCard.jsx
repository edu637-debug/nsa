/**
 * ==============================================================================
 * 파일명: src/components/BalanceCard.jsx
 * 설명: 찬성 vs 반대 3줄 핵심 논거 대칭 비교 카드 & 객관적 팩트체크 인포그래픽
 * 기능:
 *  1) 찬성(Pro)과 반대(Con)의 대표 슬로건 및 3줄 핵심 근거 대칭 렌더링
 *  2) 공공기관/학술 연구 기반 객관적 팩트체크 및 통계 지표 인포그래픽 카드
 *  3) 편향 없는 균형 잡힌 시각 형성을 지원하는 직관적 UI
 * ==============================================================================
 */

import React from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  Info, 
  ExternalLink 
} from 'lucide-react';

export default function BalanceCard({ issue }) {
  if (!issue) return null;

  return (
    <div className="w-full space-y-8 mb-8">
      
      {/* 1. 찬성 vs 반대 핵심 논거 대칭 뷰 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>⚖️ 쟁점 한눈에 비교하기</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              3줄 핵심 요약
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* [좌측] 찬성(Pro) 카드 */}
          <div className="flex flex-col bg-emerald-50/70 dark:bg-emerald-950/20 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-7 shadow-sm transition-all hover:shadow-md">
            
            {/* 찬성 헤더 */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-emerald-200 dark:border-emerald-900/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30">
                  <ThumbsUp className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    Perspective 01
                  </span>
                  <h3 className="text-lg font-bold text-emerald-950 dark:text-emerald-200">
                    찬성하는 입장
                  </h3>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500 text-white shadow-sm">
                PRO
              </span>
            </div>

            {/* 찬성 핵심 슬로건 */}
            <div className="mb-5 p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-emerald-200/60 dark:border-emerald-800/60">
              <p className="text-sm sm:text-base font-bold text-emerald-900 dark:text-emerald-300 leading-snug">
                "{issue.pro.title}"
              </p>
            </div>

            {/* 찬성 3줄 핵심 근거 리스트 */}
            <ul className="space-y-3.5 flex-1">
              {issue.pro.points.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 w-6 h-6 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {point}
                  </p>
                </li>
              ))}
            </ul>

          </div>

          {/* [우측] 반대(Con) 카드 */}
          <div className="flex flex-col bg-rose-50/70 dark:bg-rose-950/20 border-2 border-rose-500/40 rounded-3xl p-6 sm:p-7 shadow-sm transition-all hover:shadow-md">
            
            {/* 반대 헤더 */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-rose-200 dark:border-rose-900/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/30">
                  <ThumbsDown className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                    Perspective 02
                  </span>
                  <h3 className="text-lg font-bold text-rose-950 dark:text-rose-200">
                    반대하는 입장
                  </h3>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-500 text-white shadow-sm">
                CON
              </span>
            </div>

            {/* 반대 핵심 슬로건 */}
            <div className="mb-5 p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-rose-200/60 dark:border-rose-800/60">
              <p className="text-sm sm:text-base font-bold text-rose-900 dark:text-rose-300 leading-snug">
                "{issue.con.title}"
              </p>
            </div>

            {/* 반대 3줄 핵심 근거 리스트 */}
            <ul className="space-y-3.5 flex-1">
              {issue.con.points.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 w-6 h-6 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-300 flex items-center justify-center text-xs font-bold shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {point}
                  </p>
                </li>
              ))}
            </ul>

          </div>

        </div>
      </div>

      {/* 2. 객관적 팩트체크 & 통계 인포그래픽 박스 */}
      {issue.facts && issue.facts.length > 0 && (
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700 shadow-sm">
          
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100 dark:border-slate-700">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                객관적 팩트 & 공식 통계 데이터
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                감정이 아닌 검증된 지표와 공식 통계로 사안을 바라봅니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {issue.facts.map((fact, index) => (
              <div 
                key={index}
                className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    {fact.label}
                  </span>
                  <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mb-2 leading-tight">
                    {fact.value}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {fact.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>출처: {fact.source}</span>
                  <Info className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
