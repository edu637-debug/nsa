/**
 * ==============================================================================
 * 파일명: src/App.jsx
 * 설명: 유스밸런스(YouthBalance) 메인 애플리케이션 컴포넌트
 * 기능:
 *  1) 카테고리(법, 경제, 정치, 교육, 환경/기술, 사회) 및 키워드 필터링 상태 제어
 *  2) 실시간 스마트 검색 및 북마크(관심 이슈) 관리
 *  3) 투표 및 토론 데이터 실시간 동기화 (LocalStorage 영속화)
 *  4) 다크모드 및 모달 팝업 상태 관리
 * ==============================================================================
 */

import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header.jsx';
import CategoryNav from './components/CategoryNav.jsx';
import KeywordFilterBar from './components/KeywordFilterBar.jsx';
import SearchBar from './components/SearchBar.jsx';
import IssueList from './components/IssueList.jsx';
import IssueDetail from './components/IssueDetail.jsx';
import AboutModal from './components/AboutModal.jsx';
import CleanGuideModal from './components/CleanGuideModal.jsx';

import { CATEGORIES, POPULAR_KEYWORDS } from './data/initialIssues.js';
import { 
  loadIssuesData, 
  saveIssuesData, 
  loadUserVotes, 
  recordUserVote, 
  loadBookmarks, 
  toggleBookmarkStorage 
} from './utils/storage.js';

export default function App() {
  // 1. 핵심 데이터 및 뷰 상태
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // 2. 사용자 상호작용 상태 (투표, 북마크, 다크모드)
  const [userVotes, setUserVotes] = useState({});
  const [bookmarks, setBookmarks] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 3. 모달 상태
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // 4. 초기 데이터 로딩
  useEffect(() => {
    const loadedIssues = loadIssuesData();
    setIssues(loadedIssues);

    const loadedVotes = loadUserVotes();
    setUserVotes(loadedVotes);

    const loadedBms = loadBookmarks();
    setBookmarks(loadedBms);

    // 시스템 다크모드 감지
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  // 5. 다크모드 클래스 적용
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // 6. 카테고리별 이슈 개수 계산
  const issuesCountByCategory = useMemo(() => {
    const counts = { all: issues.length };
    CATEGORIES.forEach(cat => {
      if (cat.id !== 'all') {
        counts[cat.id] = issues.filter(i => i.category === cat.id).length;
      }
    });
    return counts;
  }, [issues]);

  // 7. 다차원 필터링 로직 (카테고리 + 키워드 + 검색어 + 북마크)
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      // 1) 북마크 필터
      if (showBookmarksOnly && !bookmarks.includes(issue.id)) {
        return false;
      }

      // 2) 카테고리 필터
      if (selectedCategory !== 'all' && issue.category !== selectedCategory) {
        return false;
      }

      // 3) 키워드 필터
      if (selectedKeyword && !issue.keywords.includes(selectedKeyword)) {
        return false;
      }

      // 4) 검색어 필터 (제목, 부제, 요약, 배경, 키워드, 팩트)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inTitle = issue.title.toLowerCase().includes(query);
        const inSubtitle = issue.subtitle.toLowerCase().includes(query);
        const inSummary = issue.summary.toLowerCase().includes(query);
        const inKeywords = issue.keywords.some(kw => kw.toLowerCase().includes(query));
        const inFacts = issue.facts?.some(f => f.label.toLowerCase().includes(query) || f.value.toLowerCase().includes(query));

        if (!inTitle && !inSubtitle && !inSummary && !inKeywords && !inFacts) {
          return false;
        }
      }

      return true;
    });
  }, [issues, selectedCategory, selectedKeyword, searchQuery, showBookmarksOnly, bookmarks]);

  // 8. 홈으로 이동 및 필터 초기화
  const handleGoHome = () => {
    setSelectedIssue(null);
    setShowBookmarksOnly(false);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedKeyword('');
    setSearchQuery('');
    setShowBookmarksOnly(false);
  };

  // 9. 키워드 선택 핸들러 (목록 뷰로 전환하고 키워드 적용)
  const handleSelectKeyword = (keyword) => {
    setSelectedKeyword(keyword);
    setSelectedIssue(null); // 상세 뷰에서 키워드 클릭 시 목록으로 돌아가서 필터링
  };

  // 10. 투표 핸들러
  const handleVote = (issueId, voteType, tokenHash) => {
    // 이전 투표가 있었는지 확인
    const prevVote = userVotes[issueId]?.voteType;

    const updatedIssues = issues.map((issue) => {
      if (issue.id === issueId) {
        const newVotes = { ...issue.initialVotes };
        
        // 이전 투표 차감
        if (prevVote && newVotes[prevVote] > 0) {
          newVotes[prevVote] -= 1;
        }
        
        // 새 투표 증가
        newVotes[voteType] = (newVotes[voteType] || 0) + 1;

        return { ...issue, initialVotes: newVotes };
      }
      return issue;
    });

    setIssues(updatedIssues);
    saveIssuesData(updatedIssues);

    // 사용자 투표 상태 업데이트
    recordUserVote(issueId, voteType, tokenHash);
    setUserVotes({
      ...userVotes,
      [issueId]: { voteType, tokenHash, votedAt: new Date().toISOString() }
    });

    // 상세 보기 중인 이슈도 최신화
    if (selectedIssue && selectedIssue.id === issueId) {
      const current = updatedIssues.find(i => i.id === issueId);
      if (current) setSelectedIssue(current);
    }
  };

  // 11. 토론 댓글 등록 핸들러
  const handleAddComment = (issueId, newComment) => {
    const updatedIssues = issues.map((issue) => {
      if (issue.id === issueId) {
        const updatedComments = [newComment, ...(issue.initialComments || [])];
        return { ...issue, initialComments: updatedComments };
      }
      return issue;
    });

    setIssues(updatedIssues);
    saveIssuesData(updatedIssues);

    if (selectedIssue && selectedIssue.id === issueId) {
      const current = updatedIssues.find(i => i.id === issueId);
      if (current) setSelectedIssue(current);
    }
  };

  // 12. 공감 리액션 핸들러 ('logical' 또는 'insightful')
  const handleReaction = (issueId, commentId, reactionType) => {
    const updatedIssues = issues.map((issue) => {
      if (issue.id === issueId) {
        const updatedComments = (issue.initialComments || []).map((c) => {
          if (c.id === commentId) {
            if (reactionType === 'logical') {
              return { ...c, logicalCount: (c.logicalCount || 0) + 1 };
            } else {
              return { ...c, insightfulCount: (c.insightfulCount || 0) + 1 };
            }
          }
          return c;
        });
        return { ...issue, initialComments: updatedComments };
      }
      return issue;
    });

    setIssues(updatedIssues);
    saveIssuesData(updatedIssues);

    if (selectedIssue && selectedIssue.id === issueId) {
      const current = updatedIssues.find(i => i.id === issueId);
      if (current) setSelectedIssue(current);
    }
  };

  // 13. 북마크 토글 핸들러
  const handleToggleBookmark = (issueId) => {
    const updated = toggleBookmarkStorage(issueId);
    setBookmarks(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* 1. 글로벌 헤더 */}
      <Header
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onGoHome={handleGoHome}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        showBookmarksOnly={showBookmarksOnly}
        setShowBookmarksOnly={setShowBookmarksOnly}
        bookmarkCount={bookmarks.length}
      />

      {/* 2. 메인 컨텐츠 영역 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {selectedIssue ? (
          /* [상세 뷰] 특정 이슈 상세 비교 페이지 */
          <IssueDetail
            issue={selectedIssue}
            onBack={() => setSelectedIssue(null)}
            userVote={userVotes[selectedIssue.id]}
            onVote={handleVote}
            onAddComment={handleAddComment}
            onReaction={handleReaction}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onSelectKeyword={handleSelectKeyword}
          />
        ) : (
          /* [메인 목록 뷰] 탐색 및 카드 그리드 */
          <div>
            {/* 상단 히어로 배너 */}
            <div className="mb-8 text-center sm:text-left sm:flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 p-6 sm:p-8 rounded-3xl border border-emerald-500/20 dark:border-emerald-500/30">
              <div>
                <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-emerald-500 text-white mb-2 shadow-sm">
                  ⚖️ 생각의 시소를 맞추다
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
                  찬반의 균형에서 찾는 <span className="text-emerald-600 dark:text-emerald-400">나만의 관점</span>
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
                  자극적인 뉴스 대신 객관적 팩트와 3줄 핵심 논거로 사회 이슈를 비교하고, 또래 친구들과 건강하게 생각을 나누어보세요.
                </p>
              </div>
            </div>

            {/* 통합 검색창 */}
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              resultCount={filteredIssues.length}
              totalCount={issues.length}
            />

            {/* 분야별 카테고리 탭 (법, 경제, 정치, 교육, 환경·기술, 사회) */}
            <CategoryNav
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              issuesCountByCategory={issuesCountByCategory}
            />

            {/* 원클릭 인기 키워드 해시태그 바 */}
            <KeywordFilterBar
              keywords={POPULAR_KEYWORDS}
              selectedKeyword={selectedKeyword}
              onSelectKeyword={setSelectedKeyword}
              onClearKeyword={() => setSelectedKeyword('')}
            />

            {/* 이슈 목록 헤더 및 건수 */}
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>
                  {showBookmarksOnly 
                    ? '📌 내가 저장한 관심 이슈' 
                    : selectedCategory === 'all' 
                      ? '🔥 전체 시사 이슈 목록' 
                      : `📂 ${CATEGORIES.find(c => c.id === selectedCategory)?.name} 이슈`}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {filteredIssues.length}개
                </span>
              </h2>

              {(selectedCategory !== 'all' || selectedKeyword || searchQuery || showBookmarksOnly) && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 underline"
                >
                  필터 전체 초기화
                </button>
              )}
            </div>

            {/* 이슈 카드 그리드 */}
            <IssueList
              issues={filteredIssues}
              onSelectIssue={setSelectedIssue}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onSelectKeyword={handleSelectKeyword}
              onResetFilters={handleResetFilters}
            />
          </div>
        )}

      </main>

      {/* 3. 푸터 */}
      <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            <p className="font-bold text-slate-800 dark:text-slate-200">유스밸런스 (YouthBalance)</p>
            <p>청소년의 비판적 사고와 건전한 민주시민 의식을 돕는 시사·사회 이슈 객관화 플랫폼</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsAboutOpen(true)} className="hover:underline">플랫폼 소개</button>
            <button onClick={() => setIsGuideOpen(true)} className="hover:underline">클린 토론 규칙</button>
            <span>© 2026 YouthBalance. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* 4. 모달들 */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <CleanGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

    </div>
  );
}
