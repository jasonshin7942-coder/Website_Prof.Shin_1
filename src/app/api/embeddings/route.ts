import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '@/lib/supabase';
import {
  getProfile, getResearchList, getPublicationList,
  getTeachingList, getActivityList,
} from '@/content';
import { getLocalizedText } from '@/types/content';
import type { Locale } from '@/i18n/config';

// GET — 현재 임베딩 통계
export async function GET() {
  try {
    const { data, error } = await db
      .from('content_embeddings')
      .select('id, content_type, locale, updated_at');
    if (error) throw error;

    const rows = data ?? [];
    const byType: Record<string, number> = {};
    const byLocale: Record<string, number> = {};
    let lastUpdated: string | null = null;

    for (const row of rows) {
      byType[row.content_type] = (byType[row.content_type] || 0) + 1;
      byLocale[row.locale] = (byLocale[row.locale] || 0) + 1;
      if (!lastUpdated || row.updated_at > lastUpdated) lastUpdated = row.updated_at;
    }

    return NextResponse.json({ total: rows.length, byType, byLocale, lastUpdated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST — 임베딩 재생성
export async function POST(_request: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not set' }, { status: 500 });
  }

  try {
    const [profile, research, publications, teaching, activities] = await Promise.all([
      getProfile(),
      getResearchList(),
      getPublicationList(),
      getTeachingList(),
      getActivityList(),
    ]);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const embModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

    const t = (field: any, locale: Locale) => getLocalizedText(field, locale);
    const locales: Locale[] = ['ko', 'en', 'zh'];

    // 청크 생성
    const chunks: Array<{
      id: string; content_type: string; content_id: string;
      locale: string; text_chunk: string; metadata: object;
    }> = [];

    for (const locale of locales) {
      // 프로필
      chunks.push({
        id: `profile-${locale}`,
        content_type: 'profile', content_id: 'prof-shin', locale,
        text_chunk: [
          `이름: ${t(profile.name, locale)}`,
          `소속: ${t(profile.affiliation, locale)}`,
          `소개: ${t(profile.shortIntro, locale)}`,
          `약력: ${t(profile.biography, locale)}`,
          `키워드: ${t(profile.keywords, locale)}`,
        ].join('\n'),
        metadata: { title: t(profile.name, locale) },
      });

      // 연구
      for (const r of research) {
        chunks.push({
          id: `research-${r.id}-${locale}`,
          content_type: 'research', content_id: r.id, locale,
          text_chunk: [
            `연구: ${t(r.title, locale)}`,
            `주제: ${t(r.theme, locale)}`, `연도: ${r.year}`,
            `요약: ${t(r.summary, locale)}`, `상세: ${t(r.description, locale)}`,
            `키워드: ${t(r.keywords, locale)}`,
          ].join('\n'),
          metadata: { title: t(r.title, locale), year: r.year },
        });
      }

      // 논문
      for (const p of publications) {
        chunks.push({
          id: `pub-${p.id}-${locale}`,
          content_type: 'publication', content_id: p.id, locale,
          text_chunk: [
            `논문: ${t(p.title, locale)}`,
            `저자: ${t(p.authors as any, locale)}`,
            `학술지: ${t(p.venue, locale)}`, `연도: ${p.year}`,
            `초록: ${t(p.abstract, locale)}`,
          ].join('\n'),
          metadata: { title: t(p.title, locale), year: p.year },
        });
      }

      // 강의
      for (const c of teaching) {
        chunks.push({
          id: `teach-${c.id}-${locale}`,
          content_type: 'teaching', content_id: c.id, locale,
          text_chunk: [
            `강의: ${t(c.title, locale)}`,
            `학기: ${c.semester || ''} ${c.courseType || ''}`,
            `요약: ${t(c.summary, locale)}`, `상세: ${t(c.description, locale)}`,
          ].join('\n'),
          metadata: { title: t(c.title, locale), semester: c.semester },
        });
      }

      // 활동
      for (const a of activities) {
        chunks.push({
          id: `act-${a.id}-${locale}`,
          content_type: 'activity', content_id: a.id, locale,
          text_chunk: [
            `활동: ${t(a.title, locale)}`,
            `날짜: ${a.date}`, `장소: ${t(a.location, locale)}`,
            `요약: ${t(a.summary, locale)}`, `상세: ${t(a.description, locale)}`,
          ].join('\n'),
          metadata: { title: t(a.title, locale), date: a.date },
        });
      }
    }

    // 임베딩 생성 및 저장
    let count = 0;
    for (const chunk of chunks) {
      const emb = await embModel.embedContent(chunk.text_chunk);
      await db.from('content_embeddings').upsert({
        ...chunk,
        embedding: JSON.stringify(emb.embedding.values),
        updated_at: new Date().toISOString(),
      });
      count++;
      // 속도 제한 방지
      await new Promise(r => setTimeout(r, 80));
    }

    return NextResponse.json({ success: true, count });
  } catch (e: any) {
    console.error('Embedding generation error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
