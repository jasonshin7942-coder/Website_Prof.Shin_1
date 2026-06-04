// 모든 콘텐츠의 임베딩을 생성해 Supabase에 저장합니다.
// 실행: node scripts/generate-embeddings.mjs
// (콘텐츠를 추가하거나 수정한 후 다시 실행하세요)

import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// .env.local 파싱
const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const m = line.match(/^([^#=\s]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim();
}

const supabaseUrl  = env['NEXT_PUBLIC_SUPABASE_URL'];
const serviceKey   = env['SUPABASE_SERVICE_ROLE_KEY'];
const geminiKey    = env['GEMINI_API_KEY'];

if (!supabaseUrl || !serviceKey || !geminiKey) {
  console.error('❌  .env.local에 필수 키가 없습니다.');
  process.exit(1);
}

const db     = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
const genAI  = new GoogleGenerativeAI(geminiKey);
const embModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

// 로케일별 텍스트 추출
function t(field, locale) {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[locale] || field.en || field.ko || '';
}

// 콘텐츠별 텍스트 청크 생성
function buildChunks(data, locale) {
  const chunks = [];
  const label = locale === 'ko' ? '한국어' : locale === 'zh' ? '중문' : '영문';

  // 프로필
  const p = data.profile;
  chunks.push({
    id: `profile-${locale}`,
    content_type: 'profile', content_id: 'prof-shin', locale,
    text_chunk: [
      `이름: ${t(p.name, locale)}`,
      `소속: ${t(p.affiliation, locale)}`,
      `직위: ${t(p.title, locale)}`,
      `소개: ${t(p.shortIntro, locale)}`,
      `약력: ${t(p.biography, locale)}`,
      `키워드: ${t(p.keywords, locale)}`,
    ].join('\n'),
    metadata: { title: t(p.name, locale), locale },
  });

  // 연구
  for (const r of (data.research || [])) {
    chunks.push({
      id: `research-${r.id}-${locale}`,
      content_type: 'research', content_id: r.id, locale,
      text_chunk: [
        `연구 제목: ${t(r.title, locale)}`,
        `주제: ${t(r.theme, locale)}`,
        `연도: ${r.year}`,
        `요약: ${t(r.summary, locale)}`,
        `상세: ${t(r.description, locale)}`,
        `키워드: ${t(r.keywords, locale)}`,
      ].join('\n'),
      metadata: { title: t(r.title, locale), year: r.year, locale },
    });
  }

  // 논문·저서
  for (const pub of (data.publications || [])) {
    chunks.push({
      id: `pub-${pub.id}-${locale}`,
      content_type: 'publication', content_id: pub.id, locale,
      text_chunk: [
        `논문/저서: ${t(pub.title, locale)}`,
        `저자: ${t(pub.authors, locale)}`,
        `학술지/학회: ${t(pub.venue, locale)}`,
        `연도: ${pub.year}`,
        `초록: ${t(pub.abstract, locale)}`,
        `키워드: ${t(pub.keywords, locale)}`,
      ].join('\n'),
      metadata: { title: t(pub.title, locale), year: pub.year, venue: t(pub.venue, locale), locale },
    });
  }

  // 강의
  for (const c of (data.teaching || [])) {
    chunks.push({
      id: `teach-${c.id}-${locale}`,
      content_type: 'teaching', content_id: c.id, locale,
      text_chunk: [
        `강의: ${t(c.title, locale)}`,
        `학기: ${c.semester || ''} ${c.courseType || ''}`,
        `요약: ${t(c.summary, locale)}`,
        `상세: ${t(c.description, locale)}`,
        `키워드: ${t(c.keywords, locale)}`,
      ].join('\n'),
      metadata: { title: t(c.title, locale), semester: c.semester, locale },
    });
  }

  // 활동
  for (const a of (data.activities || [])) {
    chunks.push({
      id: `act-${a.id}-${locale}`,
      content_type: 'activity', content_id: a.id, locale,
      text_chunk: [
        `활동: ${t(a.title, locale)}`,
        `날짜: ${a.date}`,
        `장소: ${t(a.location, locale)}`,
        `유형: ${a.type}`,
        `요약: ${t(a.summary, locale)}`,
        `상세: ${t(a.description, locale)}`,
      ].join('\n'),
      metadata: { title: t(a.title, locale), date: a.date, locale },
    });
  }

  return chunks;
}

// 임베딩 생성 (재시도 포함)
async function embedText(text, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await embModel.embedContent(text);
      return result.embedding.values;
    } catch (e) {
      if (i < retries - 1) {
        console.log(`  재시도 ${i + 1}/${retries}...`);
        await new Promise(r => setTimeout(r, 2000));
      } else throw e;
    }
  }
}

// 콘텐츠 데이터를 Supabase에서 로드
async function loadAllContent() {
  const [profile, research, publications, teaching, activities] = await Promise.all([
    db.from('profile').select('data').eq('id', 'prof-shin').single(),
    db.from('research').select('*'),
    db.from('publications').select('*'),
    db.from('teaching').select('*'),
    db.from('activities').select('*'),
  ]);

  const toItem = row => ({ id: row.id, published: row.published, featured: row.featured, year: row.year, sortOrder: row.sort_order, ...row.data });

  return {
    profile: profile.data?.data || {},
    research: (research.data || []).map(toItem),
    publications: (publications.data || []).map(toItem),
    teaching: (teaching.data || []).map(toItem),
    activities: (activities.data || []).map(toItem),
  };
}

async function run() {
  console.log('── 임베딩 생성 시작 ────────────────────────────');

  const data = await loadAllContent();
  const locales = ['ko', 'en', 'zh'];
  const allChunks = locales.flatMap(locale => buildChunks(data, locale));

  console.log(`총 ${allChunks.length}개 청크 (${locales.join('/')} 각각 ${allChunks.length / locales.length}개)`);

  let done = 0;
  for (const chunk of allChunks) {
    try {
      const embedding = await embedText(chunk.text_chunk);
      const { error } = await db.from('content_embeddings').upsert({
        ...chunk,
        embedding: JSON.stringify(embedding),
        updated_at: new Date().toISOString(),
      });
      if (error) console.error(`  ❌ ${chunk.id}:`, error.message);
      else {
        done++;
        process.stdout.write(`\r  진행: ${done}/${allChunks.length}`);
      }
      // 속도 제한 방지 (100ms 간격)
      await new Promise(r => setTimeout(r, 100));
    } catch (e) {
      console.error(`\n  ❌ ${chunk.id}:`, e.message);
    }
  }

  console.log(`\n✓  완료: ${done}/${allChunks.length}개 저장`);
  console.log('── 완료 ────────────────────────────────────────');
}

run().catch(console.error);
