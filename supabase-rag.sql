-- ============================================================
-- RAG 임베딩 테이블 — Supabase SQL Editor에서 실행하세요
-- ============================================================

-- pgvector 확장 활성화
CREATE EXTENSION IF NOT EXISTS vector;

-- 기존 테이블/인덱스/함수 삭제 (재실행 시 충돌 방지)
DROP FUNCTION IF EXISTS search_content;
DROP TABLE IF EXISTS content_embeddings;

-- 콘텐츠 임베딩 테이블 (gemini-embedding-001 → 3072차원)
CREATE TABLE content_embeddings (
  id           TEXT PRIMARY KEY,
  content_type TEXT NOT NULL,
  content_id   TEXT NOT NULL,
  locale       TEXT NOT NULL DEFAULT 'ko',
  text_chunk   TEXT NOT NULL,
  metadata     JSONB DEFAULT '{}',
  embedding    vector(3072),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 유사도 검색 함수
CREATE OR REPLACE FUNCTION search_content(
  query_embedding vector(3072),
  match_count     INT DEFAULT 6,
  filter_locale   TEXT DEFAULT 'ko'
)
RETURNS TABLE (
  content_type TEXT,
  content_id   TEXT,
  text_chunk   TEXT,
  metadata     JSONB,
  similarity   FLOAT
)
LANGUAGE sql STABLE AS $$
  SELECT
    ce.content_type,
    ce.content_id,
    ce.text_chunk,
    ce.metadata,
    1 - (ce.embedding <=> query_embedding) AS similarity
  FROM content_embeddings ce
  WHERE ce.locale = filter_locale
    AND ce.embedding IS NOT NULL
  ORDER BY ce.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- RLS (service_role 키로만 접근)
ALTER TABLE content_embeddings ENABLE ROW LEVEL SECURITY;
