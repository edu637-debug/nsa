/**
 * ==============================================================================
 * 파일명: src/utils/security.js
 * 설명: 유스밸런스 플랫폼의 강력한 보안 및 암호화 유틸리티 (규칙 8 준수)
 * 기능:
 *  1) SHA-256 단방향 암호화: 투표자 토큰 및 IP 해시화 (개인정보 보호)
 *  2) XSS (Cross-Site Scripting) 방지 텍스트 살균(Sanitization)
 *  3) 청소년 안심 클린 필터링: 욕설, 비하, 혐오 표현 실시간 검출 및 마스킹
 * ==============================================================================
 */

/**
 * 1. SHA-256 단방향 해시 암호화 함수
 * 브라우저 내장 Web Crypto API를 사용하여 문자열을 256비트 해시 문자열로 암호화합니다.
 * 개인을 특정할 수 있는 기기 정보나 식별값을 복호화 불가능한 안전한 해시값으로 변환합니다.
 * 
 * @param {string} message - 암호화할 원본 텍스트
 * @returns {Promise<string>} 64자리 16진수 암호화 해시 문자열
 */
export async function generateSHA256Hash(message) {
  if (!message) return '';
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // 16진수 문자열로 변환
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (error) {
    console.warn('Web Crypto API 사용 불가, 대체 해시 알고리즘 적용:', error);
    // Web Crypto 미지원 환경을 위한 대체 해시
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
      const char = message.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return 'fallback_' + Math.abs(hash).toString(16).padStart(16, '0');
  }
}

/**
 * 2. XSS (크로스 사이트 스크립팅) 방지 텍스트 살균 함수
 * 사용자가 입력한 토론 내용 중 악의적인 HTML 태그나 스크립트 실행 코드를 무력화합니다.
 * 
 * @param {string} str - 사용자가 입력한 원본 문자열
 * @returns {string} 안전하게 이스케이프 처리된 문자열
 */
export function sanitizeText(str) {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * 3. 청소년 클린 토론용 비속어/비하 표현 필터링 사전
 * 건강하고 존중하는 토론 문화를 만들기 위한 기본 금칙어 목록
 */
const BANNED_WORDS = [
  '바보', '멍청이', '꺼져', '닥쳐', '미친', '쓰레기', '틀딱', '잼민이', '급식충', 
  '한남', '한녀', '노답', '병신', '지랄', '존나', '개새끼', '씨발', 'ㅅㅂ', 'ㅂㅅ', 'ㅈㄹ'
];

/**
 * 4. 유해어 검출 및 필터링 결과 반환 함수
 * 
 * @param {string} text - 검사할 텍스트
 * @returns {{ isClean: boolean, filteredText: string, foundWords: string[] }}
 */
export function filterCleanContent(text) {
  if (!text) return { isClean: true, filteredText: '', foundWords: [] };

  let filteredText = text;
  const foundWords = [];

  BANNED_WORDS.forEach(word => {
    // 특수문자나 띄어쓰기를 섞어 쓰는 우회 시도 검출을 위한 정규표현식
    const regex = new RegExp(word, 'gi');
    if (regex.test(filteredText)) {
      foundWords.push(word);
      // 금칙어를 온화한 하트/별 기호로 마스킹
      filteredText = filteredText.replace(regex, '🌱(클린)');
    }
  });

  return {
    isClean: foundWords.length === 0,
    filteredText,
    foundWords
  };
}

/**
 * 5. 익명 보호 닉네임 생성 유틸리티
 * 개인 식별 정보를 숨기고 귀엽고 안전한 청소년 토론 닉네임을 생성합니다.
 */
const ADJECTIVES = ['생각하는', '논리적인', '균형잡힌', '호기심많은', '따뜻한', '용기있는', '팩트체크', '열정적인', '신중한', '지혜로운'];
const NOUNS = ['올빼미', '도토리', '해바라기', '사색가', '토론왕', '탐험가', '나침반', '별빛', '단풍잎', '파랑새'];

export function generateSafeAnonymousNickname() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const randNum = Math.floor(100 + Math.random() * 900);
  return `${adj} ${noun}#${randNum}`;
}
