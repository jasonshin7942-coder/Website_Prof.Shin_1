import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  getProfile, getResearchList, getPublicationList,
  getTeachingList, getActivityList,
} from '@/content';
import { getLocalizedText } from '@/types/content';
import type { Locale } from '@/i18n/config';

async function buildSystemPrompt(locale: Locale): Promise<string> {
  const [profile, research, publications, teaching, activities] = await Promise.all([
    getProfile(),
    getResearchList({ published: true }),
    getPublicationList({ published: true }),
    getTeachingList({ published: true }),
    getActivityList({ published: true }),
  ]);

  const t = (field: any) => getLocalizedText(field, locale);

  const researchBlock = research.map(r =>
    `- [${r.year}] ${t(r.title)}: ${t(r.summary)}`
  ).join('\n');

  const pubBlock = publications.slice(0, 20).map(p =>
    `- [${p.year}] ${t(p.title)} / ${t(p.authors as any)} / ${t(p.venue)}`
  ).join('\n');

  const teachBlock = teaching.map(c =>
    `- ${t(c.title)} (${c.semester || ''} ${c.courseType || ''}): ${t(c.summary)}`
  ).join('\n');

  const actBlock = activities.map(a =>
    `- [${a.date}] ${t(a.title)} @ ${t(a.location)}: ${t(a.summary)}`
  ).join('\n');

  const instructions: Record<Locale, string> = {
    ko: `당신은 신종천 교수의 공식 웹사이트 AI 어시스턴트입니다.
아래 교수님 정보를 바탕으로 방문자 질문에 친절하고 구체적으로 답변하세요.
- 반드시 한국어로 답변하세요.
- 모르는 내용은 추측하지 말고 "확인이 어렵습니다"라고 답하세요.
- 2~4문단 정도로 상세하게 작성하세요.`,
    en: `You are the AI assistant for Professor Jongcheon Shin's official website.
Answer visitors' questions kindly and specifically based on the professor's information below.
- Always respond in English.
- Do not guess; say "I cannot confirm that" for unknown information.
- Write 2-4 detailed paragraphs.`,
    zh: `您是辛鍾天教授官方网站的AI助手。
请根据以下教授信息，友善且具体地回答访客问题。
- 请务必用中文回答。
- 不确定的信息请回答"无法确认"。
- 请详细写2-4段。`,
  };

  return `${instructions[locale] || instructions.ko}

=== 교수 정보 ===

【기본 정보】
이름: ${t(profile.name)}
소속: ${t(profile.affiliation)}
직위: ${t(profile.title)}
이메일: ${profile.email || ''}
소개: ${t(profile.shortIntro)}
약력: ${t(profile.biography)}
키워드: ${t(profile.keywords)}

【연구 (${research.length}건)】
${researchBlock || '없음'}

【저서·논문 (${publications.length}건)】
${pubBlock || '없음'}

【강의 (${teaching.length}건)】
${teachBlock || '없음'}

【활동 (${activities.length}건)】
${actBlock || '없음'}`;
}

export async function POST(request: NextRequest) {
  const { message, history = [], locale = 'ko' } = await request.json();

  if (!message) {
    return NextResponse.json({ error: 'Message required' }, { status: 400 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({
      id: Date.now().toString(),
      role: 'assistant',
      content: locale === 'ko'
        ? 'AI 어시스턴트가 아직 설정되지 않았습니다.'
        : locale === 'zh' ? 'AI助手尚未配置。'
        : 'The AI assistant is not yet configured.',
      sources: [],
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const systemPrompt = await buildSystemPrompt(locale as Locale);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt,
    });

    // Convert history to Gemini format
    const geminiHistory = history
      .filter((m: any) => m.role === 'user' || m.role === 'assistant')
      .map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(message);
    const content = result.response.text();

    return NextResponse.json({
      id: Date.now().toString(),
      role: 'assistant',
      content,
      sources: [],
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Gemini API error:', error?.message || error);
    const fallback = locale === 'ko'
      ? '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      : locale === 'zh' ? '发生临时错误，请稍后再试。'
      : 'A temporary error occurred. Please try again later.';
    return NextResponse.json({ error: fallback }, { status: 500 });
  }
}
