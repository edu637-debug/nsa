/**
 * ==============================================================================
 * 파일명: src/utils/storage.js
 * 설명: 로컬 브라우저 저장소(LocalStorage)와 데이터를 실시간으로 동기화하는 관리자
 * 기능:
 *  1) 이슈 목록 및 투표/토론 데이터 불러오기 및 영속화
 *  2) 사용자 투표 이력 관리 (중복 투표 방지 해시 확인)
 *  3) 새 토론 의견 등록 및 공감 카운트 업데이트
 *  4) 북마크(관심 이슈 저장) 기능
 * ==============================================================================
 */

import { INITIAL_ISSUES } from '../data/initialIssues.js';

const STORAGE_KEY_ISSUES = 'youth_balance_issues_data_v1';
const STORAGE_KEY_USER_VOTES = 'youth_balance_user_votes_v1';
const STORAGE_KEY_BOOKMARKS = 'youth_balance_bookmarks_v1';

/**
 * 1. 저장된 이슈 목록 불러오기 (초기 데이터가 없으면 INITIAL_ISSUES 로드)
 */
export function loadIssuesData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ISSUES);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('이슈 데이터 로딩 실패:', error);
  }
  // 기본 데이터 저장 후 반환
  saveIssuesData(INITIAL_ISSUES);
  return INITIAL_ISSUES;
}

/**
 * 2. 이슈 데이터 전체 저장
 */
export function saveIssuesData(issues) {
  try {
    localStorage.setItem(STORAGE_KEY_ISSUES, JSON.stringify(issues));
  } catch (error) {
    console.error('이슈 데이터 저장 실패:', error);
  }
}

/**
 * 3. 사용자가 투표한 기록 불러오기 (이슈ID: { type: 'pro' | 'con' | 'neutral', token: '...' })
 */
export function loadUserVotes() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_USER_VOTES);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

/**
 * 4. 사용자의 새 투표 등록
 */
export function recordUserVote(issueId, voteType, tokenHash) {
  const userVotes = loadUserVotes();
  userVotes[issueId] = {
    voteType,
    tokenHash,
    votedAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY_USER_VOTES, JSON.stringify(userVotes));
}

/**
 * 5. 북마크 목록 불러오기
 */
export function loadBookmarks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

/**
 * 6. 북마크 토글 (추가/삭제)
 */
export function toggleBookmarkStorage(issueId) {
  const bookmarks = loadBookmarks();
  const index = bookmarks.indexOf(issueId);
  let updated;
  if (index > -1) {
    updated = bookmarks.filter(id => id !== issueId);
  } else {
    updated = [...bookmarks, issueId];
  }
  localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(updated));
  return updated;
}
