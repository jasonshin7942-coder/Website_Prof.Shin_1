-- ============================================================
-- 신종천 교수 웹사이트 — Supabase 스키마
-- Supabase 대시보드 → SQL Editor → New query → 아래 전체 붙여넣기 후 Run
-- ============================================================

-- 각 테이블은 queryable 컬럼 (id, published, featured, year, sort_order) +
-- JSONB `data` 컬럼 (나머지 모든 필드 저장) 의 하이브리드 구조입니다.

-- Profile (단일 행)
CREATE TABLE IF NOT EXISTS profile (
  id TEXT PRIMARY KEY DEFAULT 'prof-shin',
  data JSONB NOT NULL DEFAULT '{}'
);

-- Research
CREATE TABLE IF NOT EXISTS research (
  id TEXT PRIMARY KEY,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  featured  BOOLEAN NOT NULL DEFAULT FALSE,
  year      INTEGER NOT NULL DEFAULT 2024,
  sort_order INTEGER,
  data      JSONB NOT NULL DEFAULT '{}'
);

-- Publications
CREATE TABLE IF NOT EXISTS publications (
  id TEXT PRIMARY KEY,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  featured  BOOLEAN NOT NULL DEFAULT FALSE,
  year      INTEGER NOT NULL DEFAULT 2024,
  sort_order INTEGER,
  data      JSONB NOT NULL DEFAULT '{}'
);

-- Teaching
CREATE TABLE IF NOT EXISTS teaching (
  id TEXT PRIMARY KEY,
  published  BOOLEAN NOT NULL DEFAULT FALSE,
  featured   BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER,
  data       JSONB NOT NULL DEFAULT '{}'
);

-- Activities
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  published  BOOLEAN NOT NULL DEFAULT FALSE,
  featured   BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER,
  data       JSONB NOT NULL DEFAULT '{}'
);

-- Settings (단일 행)
CREATE TABLE IF NOT EXISTS settings (
  id   TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB NOT NULL DEFAULT '{}'
);

-- Messages (연락하기 폼)
CREATE TABLE IF NOT EXISTS messages (
  id         TEXT PRIMARY KEY,
  read       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  data       JSONB NOT NULL DEFAULT '{}'
);

-- ── Row Level Security ───────────────────────────────────────────────────────
-- 서버 코드는 service_role 키를 사용하므로 RLS를 자동으로 우회합니다.
-- 아래 정책은 anon 키로 직접 접근할 경우 공개 데이터만 노출하는 추가 보호입니다.

ALTER TABLE profile      ENABLE ROW LEVEL SECURITY;
ALTER TABLE research     ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE teaching     ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities   ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages     ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 허용 (published 필터는 서버 코드에서 처리)
CREATE POLICY "public_read_profile"      ON profile      FOR SELECT USING (true);
CREATE POLICY "public_read_research"     ON research     FOR SELECT USING (true);
CREATE POLICY "public_read_publications" ON publications FOR SELECT USING (true);
CREATE POLICY "public_read_teaching"     ON teaching     FOR SELECT USING (true);
CREATE POLICY "public_read_activities"   ON activities   FOR SELECT USING (true);
CREATE POLICY "public_read_settings"     ON settings     FOR SELECT USING (true);
-- messages 는 공개 읽기 불가 (관리자만 service_role 로 접근)
