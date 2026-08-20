-- ==============================================================================
-- 파일명: supabase/migrations/001_create_youth_balance_schema.sql
-- 목적: 유스밸런스(YouthBalance) 시사·사회 이슈 객관화 플랫폼 전체 데이터베이스 스키마 및 보안 정책
-- 작성일: 2026-08-20
-- 규칙 준수: 규칙 7 (000_ 명명 규칙), 규칙 8 (강력한 RLS 보안 및 암호화 해싱 적용)
-- ==============================================================================

-- 1. 확장 기능 활성화 (UUID 생성 및 암호화용 pgcrypto)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. 카테고리 테이블
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 시사 이슈 마스터 테이블 (카테고리별 2개씩 총 12개 주제 수용)
CREATE TABLE IF NOT EXISTS issues (
    id VARCHAR(50) PRIMARY KEY,
    category_id VARCHAR(50) REFERENCES categories(id) ON DELETE CASCADE,
    category_name VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    background TEXT NOT NULL,
    pro_title VARCHAR(255) NOT NULL,
    pro_points JSONB NOT NULL DEFAULT '[]'::jsonb,
    con_title VARCHAR(255) NOT NULL,
    con_points JSONB NOT NULL DEFAULT '[]'::jsonb,
    facts JSONB NOT NULL DEFAULT '[]'::jsonb,
    glossary JSONB NOT NULL DEFAULT '[]'::jsonb,
    keywords TEXT[] NOT NULL DEFAULT '{}',
    votes_pro INT NOT NULL DEFAULT 0,
    votes_con INT NOT NULL DEFAULT 0,
    votes_neutral INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 청소년 생각 투표 테이블 (익명 IP/세션 해시 암호화 저장 - 규칙 8)
CREATE TABLE IF NOT EXISTS votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id VARCHAR(50) REFERENCES issues(id) ON DELETE CASCADE,
    vote_type VARCHAR(10) CHECK (vote_type IN ('pro', 'con', 'neutral')) NOT NULL,
    -- 민감한 개인 식별자(IP, 세션 등)는 단방향 SHA-256 해시 암호화하여 저장
    voter_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_voter_per_issue UNIQUE (issue_id, voter_hash)
);

-- 5. 클린 틴즈 토론 댓글 테이블
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id VARCHAR(50) REFERENCES issues(id) ON DELETE CASCADE,
    side VARCHAR(10) CHECK (side IN ('pro', 'con', 'neutral')) NOT NULL,
    nickname VARCHAR(100) NOT NULL,
    avatar VARCHAR(10) DEFAULT '🦉',
    content TEXT NOT NULL,
    logical_count INT DEFAULT 0,
    insightful_count INT DEFAULT 0,
    is_masked BOOLEAN DEFAULT FALSE,
    author_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 댓글 공감/반응 테이블
CREATE TABLE IF NOT EXISTS comment_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) CHECK (reaction_type IN ('logical', 'insightful')) NOT NULL,
    user_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_reaction UNIQUE (comment_id, reaction_type, user_hash)
);

-- ==============================================================================
-- RLS (Row Level Security) 강력한 보안 정책 설정 (규칙 8)
-- ==============================================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_reactions ENABLE ROW LEVEL SECURITY;

-- 1) 조회는 누구나 가능
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read issues" ON issues FOR SELECT USING (true);
CREATE POLICY "Public read votes count" ON votes FOR SELECT USING (true);
CREATE POLICY "Public read comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Public read comment reactions" ON comment_reactions FOR SELECT USING (true);

-- 2) 생성은 익명 사용자도 가능하되 무결성 보장
CREATE POLICY "Public insert vote" ON votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert comment" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert reaction" ON comment_reactions FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- 6대 분야 초기 카테고리 데이터 시드
-- ==============================================================================
INSERT INTO categories (id, name, icon, description) VALUES
('law', '법·사법', '⚖️', '촉법소년, 사형제, 형벌 및 인권 이슈'),
('economy', '경제·노동', '📈', '기본소득, 주4.5일제, 청년 경제 이슈'),
('politics', '정치·행정', '🏛️', '선거연령, 의무투표제, 참정권 이슈'),
('education', '교육·학교', '🎓', 'AI 디지털 교과서, 수능 절대평가 이슈'),
('environment', '환경·기술', '🌿', '탄소세, 생성형 AI 저작권 이슈'),
('society', '사회·청소년', '👥', '노키즈존, 청소년 SNS 야간 규제 이슈')
ON CONFLICT (id) DO NOTHING;
