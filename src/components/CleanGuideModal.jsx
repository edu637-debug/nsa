/**
 * ==============================================================================
 * 파일명: src/components/CleanGuideModal.jsx
 * 설명: 청소년 건전 토론 가이드라인 모달 컴포넌트
 * ==============================================================================
 */

import React from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, MessageSquare } from 'lucide-react';

export default function CleanGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 relative max-h-[90vh] overflow-y-auto">
        
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 상단 타이틀 */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              청소년 클린 토론 가이드라인
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              서로의 다름을 인정하고 존중하는 건강한 대화의 규칙
            </p>
          </div>
        </div>

        {/* 규칙 리스트 */}
        <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
          
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-950 dark:text-emerald-200 mb-1">
                1. '사람'이 아닌 '의견과 근거'에 집중하기
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                나와 생각이 다르다고 해서 상대방의 인격을 비하하거나 비난하지 않고, 주장 뒤에 있는 근거를 검토합니다.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-950 dark:text-emerald-200 mb-1">
                2. 객관적인 팩트와 출처를 활용하기
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                확인되지 않은 루머나 가짜뉴스 대신 통계청, 언론 보도, 연구 자료 등 신뢰할 수 있는 데이터를 근거로 제시합니다.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/50">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-rose-950 dark:text-rose-200 mb-1">
                3. 욕설, 혐오 표현 및 조롱 절대 금지
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                비속어, 혐오 표현(특정 성별·연령·지역 비하 등)은 유스밸런스 클린 봇에 의해 자동으로 마스킹되며 제재될 수 있습니다.
              </p>
            </div>
          </div>

        </div>

        {/* 하단 닫기 */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white dark:text-slate-950 font-bold rounded-xl text-sm transition-colors"
          >
            약속하고 지키겠습니다
          </button>
        </div>

      </div>
    </div>
  );
}
