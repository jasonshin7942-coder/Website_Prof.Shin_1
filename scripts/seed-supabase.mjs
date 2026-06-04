// 기존 data/content.json 데이터를 Supabase로 마이그레이션합니다.
// 실행: node scripts/seed-supabase.mjs
// (반드시 .env.local 이 존재하고 Supabase 테이블이 생성된 후 실행하세요)

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// .env.local 파싱
const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

const url = env['NEXT_PUBLIC_SUPABASE_URL'];
const key = env['SUPABASE_SERVICE_ROLE_KEY'];
if (!url || !key) {
  console.error('❌  .env.local 에 SUPABASE_URL 또는 SERVICE_ROLE_KEY 가 없습니다.');
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

// content.json 읽기
const contentPath = join(__dirname, '..', 'data', 'content.json');
const { profile, research, publications, teaching, activities, settings } = JSON.parse(
  readFileSync(contentPath, 'utf-8')
);

async function upsert(table, rows) {
  const { error } = await db.from(table).upsert(rows);
  if (error) {
    console.error(`❌  ${table}:`, error.message);
  } else {
    console.log(`✓  ${table}: ${rows.length}개 삽입/업데이트`);
  }
}

async function run() {
  console.log('── 마이그레이션 시작 ──────────────────────────');

  // Profile
  await upsert('profile', [{ id: 'prof-shin', data: profile }]);

  // Research
  await upsert('research', research.map(({ id, published, featured, year, sortOrder, ...rest }) => ({
    id, published, featured, year: year ?? 2024, sort_order: sortOrder ?? null, data: rest,
  })));

  // Publications
  await upsert('publications', publications.map(({ id, published, featured, year, sortOrder, ...rest }) => ({
    id, published, featured, year: year ?? 2024, sort_order: sortOrder ?? null, data: rest,
  })));

  // Teaching
  await upsert('teaching', teaching.map(({ id, published, featured, sortOrder, ...rest }) => ({
    id, published, featured, sort_order: sortOrder ?? null, data: rest,
  })));

  // Activities
  await upsert('activities', activities.map(({ id, published, featured, sortOrder, ...rest }) => ({
    id, published, featured, sort_order: sortOrder ?? null, data: rest,
  })));

  // Settings
  if (settings) {
    await upsert('settings', [{ id: 'main', data: settings }]);
  } else {
    console.log('ℹ  settings: 기존 데이터 없음, 빈 레코드 생성');
    await upsert('settings', [{ id: 'main', data: {} }]);
  }

  console.log('── 완료 ───────────────────────────────────────');
}

run().catch(console.error);
