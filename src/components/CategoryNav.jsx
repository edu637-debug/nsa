/**
 * ==============================================================================
 * 파일명: src/components/CategoryNav.jsx
 * 설명: 법, 경제, 정치, 교육, 환경/기술, 사회 등 분야별 카테고리 네비게이션 탭
 * 기능:
 *  1) 분야별 원클릭 카테고리 필터링
 *  2) 각 카테고리별 등록된 이슈 개수 뱃지 표시
 *  3) 모바일/데스크톱 모두 가로 스크롤 및 탭 전환 지원
 * ==============================================================================
 */

import React from 'react';
import { 
  Sparkles, 
  Scale, 
  TrendingUp, 
  Landmark, 
  GraduationCap, 
  Leaf, 
  Users 
} from 'lucide-react';

// 아이콘 이름 매핑 테이블
const ICON_MAP = {
  Sparkles: Sparkles,
  Scale: Scale,
  TrendingUp: TrendingUp,
  Landmark: Landmark,
  GraduationCap: GraduationCap,
  Leaf: Leaf,
  Users: Users,
};

export default function CategoryNav({
  categories,
  selectedCategory,
  onSelectCategory,
  issuesCountByCategory
}) {
  return (
    <div className="w-full mb-4">
      {/* 카테고리 가로 스크롤 영역 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {categories.map((category) => {
          const IconComponent = ICON_MAP[category.icon] || Sparkles;
          const isSelected = selectedCategory === category.id;
          const count = issuesCountByCategory[category.id] || 0;

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200 shrink-0 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 dark:bg-emerald-500 dark:text-slate-950 scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60'
              }`}
            >
              <IconComponent className={`w-4 h-4 ${isSelected ? 'text-emerald-400 dark:text-slate-950' : 'text-slate-400 dark:text-slate-500'}`} />
              <span>{category.name}</span>
              
              {/* 카테고리별 이슈 개수 배지 */}
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                isSelected
                  ? 'bg-slate-800 text-emerald-300 dark:bg-emerald-600 dark:text-slate-950'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
