/**
 * ==============================================================================
 * 파일명: src/components/GlossaryTooltip.jsx
 * 설명: 청소년을 위한 알기 쉬운 시사 용어 사전 모달 & 툴팁 컴포넌트
 * 기능:
 *  1) 이슈와 관련된 어려운 법률/경제/정치 용어 목록 제공
 *  2) 용어 클릭 시 쉬운 뜻풀이와 실생활 예시 문장 안내
 *  3) 청소년 문해력 향상을 돕는 교육적 인터랙션
 * ==============================================================================
 */

import React, { useState } from 'react';
import { BookOpen, HelpCircle, X, Sparkles, CheckCircle2 } from 'lucide-react';

export default function GlossaryTooltip({ glossary = [] }) {
  const [selectedTerm, setSelectedTerm] = useState(null);

  if (!glossary || glossary.length === 0) return null;

  return (
    <div className="w-full bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 p-5 rounded-2xl border border-amber-500/20 dark:border-amber-500/30 mb-8">
      
      {/* 상단 타이틀 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm sm:text-base">
          <BookOpen className="w-5 h-5 text-amber-500" />
          <span>청소년 알기 쉬운 용어 사전</span>
          <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            클릭해서 뜻 알아보기
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 mb-3.5">
        토론과 기사를 읽을 때 헷갈리는 어려운 시사 단어들을 청소년 눈높이로 쉽게 풀어두었습니다.
      </p>

      {/* 용어 칩 버튼 리스트 */}
      <div className="flex flex-wrap gap-2">
        {glossary.map((item, index) => (
          <button
            key={index}
            onClick={() => setSelectedTerm(item)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-amber-50 hover:text-amber-900 dark:hover:bg-slate-700 font-semibold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>{item.term}</span>
          </button>
        ))}
      </div>

      {/* 용어 해설 상세 팝업 모달 */}
      {selectedTerm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 relative animate-scaleUp">
            
            {/* 닫기 버튼 */}
            <button
              onClick={() => setSelectedTerm(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* 헤더 */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">쉬운 용어 돋보기</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedTerm.term}
                </h3>
              </div>
            </div>

            {/* 본문 뜻풀이 */}
            <div className="bg-slate-50 dark:bg-slate-900/70 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 mb-4">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>쉽게 이해하는 뜻</span>
              </h4>
              <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {selectedTerm.definition}
              </p>
            </div>

            {/* 실생활 예시 문장 */}
            {selectedTerm.example && (
              <div className="bg-amber-50/60 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200/50 dark:border-amber-900/50 mb-5">
                <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 mb-1">
                  💡 대화 속 실제 쓰임새
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic">
                  {selectedTerm.example}
                </p>
              </div>
            )}

            {/* 확인 닫기 버튼 */}
            <button
              onClick={() => setSelectedTerm(null)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white dark:text-slate-950 font-bold rounded-xl text-sm transition-colors"
            >
              이해했어요! 닫기
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
