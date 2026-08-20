/**
 * ==============================================================================
 * 파일명: src/components/DebateBoard.jsx
 * 설명: 청소년 클린 토론 게시판 컴포넌트
 * 기능:
 *  1) 찬성 / 반대 / 중립 / 전체 탭별 토론 의견 분리 필터링
 *  2) 안전한 익명 닉네임 자동 추천 및 캐릭터 아바타 선택
 *  3) 비방/비속어 실시간 필터링 안내 및 XSS 방지 처리 (보안 규칙 준수)
 *  4) '논리적이에요', '새로운 시각이에요' 건설적 공감 리액션
 * ==============================================================================
 */

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  ThumbsUp, 
  Lightbulb, 
  AlertCircle,
  CheckCircle2,
  Smile,
  RefreshCw
} from 'lucide-react';
import { sanitizeText, filterCleanContent, generateSafeAnonymousNickname } from '../utils/security.js';

const AVATARS = [
  { id: 'avatar_1', name: '올빼미', icon: '🦉' },
  { id: 'avatar_2', name: '도토리', icon: '🌰' },
  { id: 'avatar_3', name: '나침반', icon: '🧭' },
  { id: 'avatar_4', name: '해바라기', icon: '🌻' },
  { id: 'avatar_5', name: '별빛', icon: '⭐' },
  { id: 'avatar_6', name: '파랑새', icon: '🐦' },
];

export default function DebateBoard({
  issue,
  onAddComment,
  onReaction
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pro' | 'con' | 'neutral'
  const [side, setSide] = useState('pro');
  const [nickname, setNickname] = useState(generateSafeAnonymousNickname());
  const [selectedAvatar, setSelectedAvatar] = useState('avatar_1');
  const [content, setContent] = useState('');
  const [cleanWarning, setCleanWarning] = useState(null);

  const comments = issue.initialComments || [];

  // 탭별 필터링
  const filteredComments = activeTab === 'all' 
    ? comments 
    : comments.filter(c => c.side === activeTab);

  // 닉네임 새로고침
  const handleRefreshNickname = () => {
    setNickname(generateSafeAnonymousNickname());
  };

  // 의견 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!content.trim()) {
      alert('토론 의견을 입력해 주세요.');
      return;
    }

    // 1. 비속어/비하 표현 클린 필터링 검사
    const { isClean, filteredText, foundWords } = filterCleanContent(content);

    if (!isClean) {
      setCleanWarning(`건전한 토론을 위해 부적절한 표현('${foundWords.join(', ')}')이 순화 처리되었습니다.`);
    } else {
      setCleanWarning(null);
    }

    // 2. XSS 방지 살균
    const safeContent = sanitizeText(filteredText);
    const safeNickname = sanitizeText(nickname.trim() || '익명 토론자');

    const newComment = {
      id: `comment_${Date.now()}`,
      side,
      nickname: safeNickname,
      avatarId: selectedAvatar,
      content: safeContent,
      createdAt: new Date().toLocaleDateString('ko-KR', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      logicalCount: 0,
      insightfulCount: 0
    };

    onAddComment(issue.id, newComment);
    setContent('');
  };

  return (
    <div className="w-full bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
      
      {/* 1. 상단 타이틀 & 탭 네비게이션 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>클린 틴즈 토론 광장</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                {comments.length}개의 생각
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              상대방을 존중하며 근거를 바탕으로 건강하게 생각을 나누는 공간입니다.
            </p>
          </div>
        </div>

        {/* 입장별 탭 버튼 */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl self-start md:self-auto border border-slate-200/60 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            전체 ({comments.length})
          </button>
          <button
            onClick={() => setActiveTab('pro')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'pro'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
            }`}
          >
            찬성 ({comments.filter(c => c.side === 'pro').length})
          </button>
          <button
            onClick={() => setActiveTab('con')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'con'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30'
            }`}
          >
            반대 ({comments.filter(c => c.side === 'con').length})
          </button>
          <button
            onClick={() => setActiveTab('neutral')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'neutral'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            중립 ({comments.filter(c => c.side === 'neutral').length})
          </button>
        </div>
      </div>

      {/* 2. 새 의견 작성 폼 */}
      <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 mb-8">
        
        {/* 상단: 입장 선택 & 아바타 & 닉네임 */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          
          {/* 나의 입장 선택 라디오 */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">내 입장:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSide('pro')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  side === 'pro'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                찬성측
              </button>
              <button
                type="button"
                onClick={() => setSide('neutral')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  side === 'neutral'
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                중립측
              </button>
              <button
                type="button"
                onClick={() => setSide('con')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  side === 'con'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                반대측
              </button>
            </div>
          </div>

          {/* 안전한 닉네임 및 아바타 선택 */}
          <div className="flex items-center gap-2">
            {/* 아바타 선택 */}
            <div className="flex items-center gap-1">
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setSelectedAvatar(av.id)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm transition-transform ${
                    selectedAvatar === av.id
                      ? 'ring-2 ring-emerald-500 scale-110 bg-emerald-100 dark:bg-emerald-950'
                      : 'hover:bg-slate-200 dark:hover:bg-slate-700 opacity-70 hover:opacity-100'
                  }`}
                  title={av.name}
                >
                  {av.icon}
                </button>
              ))}
            </div>

            {/* 닉네임 인풋 및 새로고침 */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={20}
                className="w-32 sm:w-36 text-xs font-bold bg-transparent text-slate-800 dark:text-white focus:outline-none"
                placeholder="익명 닉네임"
              />
              <button
                type="button"
                onClick={handleRefreshNickname}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                title="랜덤 닉네임 새로고침"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

        {/* 텍스트 입력창 */}
        <div className="relative mb-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="자신의 의견과 그렇게 생각한 이유(논거)를 자유롭고 정중하게 적어주세요. (욕설 및 비하는 자동 필터링됩니다)"
            rows={3}
            className="w-full p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all resize-none"
          />
        </div>

        {/* 클린 경고 안내 메시지 */}
        {cleanWarning && (
          <div className="mb-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{cleanWarning}</span>
          </div>
        )}

        {/* 하단 등록 버튼 & 클린 배지 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>안전한 청소년 암호화 토론 시스템 가동 중</span>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white dark:text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>의견 남기기</span>
          </button>
        </div>

      </form>

      {/* 3. 댓글 리스트 */}
      <div className="space-y-4">
        {filteredComments.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">아직 등록된 의견이 없습니다. 첫 번째 토론자가 되어보세요!</p>
          </div>
        ) : (
          filteredComments.map((comment) => {
            const avatar = AVATARS.find(a => a.id === comment.avatarId) || AVATARS[0];
            
            const sideStyles = {
              pro: 'border-l-4 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10',
              con: 'border-l-4 border-rose-500 bg-rose-50/20 dark:bg-rose-950/10',
              neutral: 'border-l-4 border-slate-400 bg-slate-50 dark:bg-slate-900/40'
            };

            const sideBadges = {
              pro: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
              con: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
              neutral: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
            };

            const sideLabels = {
              pro: '찬성 입장',
              con: '반대 입장',
              neutral: '중립 입장'
            };

            return (
              <div
                key={comment.id}
                className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shadow-sm ${sideStyles[comment.side] || sideStyles.pro}`}
              >
                {/* 작성자 정보 헤더 */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl" title={avatar.name}>
                      {avatar.icon}
                    </span>
                    <div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {comment.nickname}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">
                        {comment.createdAt}
                      </span>
                    </div>
                  </div>

                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${sideBadges[comment.side] || sideBadges.pro}`}>
                    {sideLabels[comment.side] || '찬성'}
                  </span>
                </div>

                {/* 의견 본문 */}
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal mb-4 pl-1">
                  {comment.content}
                </p>

                {/* 하단 공감 리액션 버튼 */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <button
                    onClick={() => onReaction(issue.id, comment.id, 'logical')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300 text-xs font-semibold transition-colors"
                    title="논리적인 근거가 잘 갖추어진 의견에 공감합니다"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" />
                    <span>논리적이에요</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {comment.logicalCount || 0}
                    </span>
                  </button>

                  <button
                    onClick={() => onReaction(issue.id, comment.id, 'insightful')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300 text-xs font-semibold transition-colors"
                    title="미처 생각하지 못했던 새로운 관점을 제시해 주었습니다"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>새로운 시각이에요</span>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      {comment.insightfulCount || 0}
                    </span>
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
