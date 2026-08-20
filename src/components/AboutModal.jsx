/**
 * ==============================================================================
 * 파일명: src/components/AboutModal.jsx
 * 설명: 유스밸런스 플랫폼 소개 및 객관화 철학 안내 모달
 * ==============================================================================
 */

import React from 'react';
import { X, Scale, Target, Shield, HeartHandshake, BookOpen } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 relative max-h-[90vh] overflow-y-auto">
        
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
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              유스밸런스 (YouthBalance) 소개
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              청소년을 위한 시사·사회 이슈 객관화 플랫폼
            </p>
          </div>
        </div>

        {/* 본문 소개 */}
        <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300">
          
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-500" />
              <span>우리가 유스밸런스를 만든 이유</span>
            </h3>
            <p className="leading-relaxed">
              알고리즘 기반의 숏폼과 자극적인 뉴스 헤드라인 속에서 청소년들은 한쪽 입장만을 무비판적으로 수용하기 쉽습니다. 유스밸런스는 <strong>법, 경제, 정치, 교육, 기술, 사회</strong>의 복잡한 쟁점들을 균형 잡힌 시각과 팩트 데이터로 정리하여, 청소년이 스스로 합리적인 판단을 내릴 수 있도록 돕습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60">
              <h4 className="font-bold text-emerald-900 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>3줄 핵심 논거 대칭 뷰</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                찬성과 반대의 가장 강력한 논거를 나란히 비교하여 양측의 입장을 모두 편견 없이 이해합니다.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/60">
              <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-1 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-indigo-600" />
                <span>안전한 클린 익명 토론</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                비속어 필터링과 SHA-256 암호화로 청소년의 개인정보를 철저히 보호하며 건강하게 토론합니다.
              </p>
            </div>

          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60">
            <h4 className="font-bold text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-amber-600" />
              <span>건설적 공감 리액션</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              단순 '좋아요' 대신 '논리적이에요', '새로운 시각이에요' 버튼을 통해 생각의 성장을 격려합니다.
            </p>
          </div>

        </div>

        {/* 하단 닫기 */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white dark:text-slate-950 font-bold rounded-xl text-sm transition-colors"
          >
            확인했습니다
          </button>
        </div>

      </div>
    </div>
  );
}
