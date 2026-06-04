import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '@/lib/supabase';
import type { Locale } from '@/i18n/config';

const SYSTEM_INSTRUCTIONS: Record<Locale, string> = {
  ko: `당신은 신종천 교수의 공식 웹사이트 AI 어시스턴트입니다.
아래 [관련 정보]를 최대한 활용하여 질문에 구체적이고 상세하게 답변하세요.
- 반드시 한국어로 답변하세요.
- 관련 정보에 없는 내용은 "해당 정보는 확인이 어렵습니다"라고 답하세요.
- 연구, 논문, 강의, 활동 등 구체적인 제목과 내용을 적극 인용하세요.
- 답변은 2~4문단으로 작성하세요.`,

  en: `You are the AI assistant for Professor Jongcheon Shin's official website.
Use the [Relevant Information] below to answer questions specifically and in detail.
- Always respond in English.
- For information not in the context, say "I cannot confirm that information."
- Actively cite specific titles and details from research, publications, teaching, and activities.
- Write 2-4 detailed paragraphs.`,

  zh: `您是辛鍾天教授官方网站的AI助手。
请充分利用下方[相关信息]，具体详细地回答问题。
- 请务必用中文回答。
- 对于信息中没有的内容，请回答"无法确认该信息"。
- 积极引用研究、论文、课程、活动等的具体标题和内容。
- 请写2-4段详细内容。`,
};

async function searchRelevantContent(question: string, locale: Locale, topK = 8) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const embModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

  const embResult = await embModel.embedContent(question);
  const queryEmbedding = embResult.embedding.values;

  const { data, error } = await db.rpc('search_content', {
    query_embedding: JSON.stringify(queryEmbedding),
    match_count: topK,
    filter_locale: locale,
  });

  if (error) throw new Error(`Vector search failed: ${error.message}`);
  return data ?? [];
}

export async function POST(request: NextRequest) {
  const { message, history = [], locale = 'ko' } = await request.json();

  if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 });

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({
      id: Date.now().toString(), role: 'assistant',
      content: locale === 'ko' ? 'AI 어시스턴트가 설정되지 않았습니다.' : 'AI assistant not configured.',
      sources: [], timestamp: new Date().toISOString(),
    });
  }

  try {
    // 1. 질문과 관련된 콘텐츠 검색 (RAG)
    const relevant = await searchRelevantContent(message, locale as Locale);

    // 2. 검색 결과로 컨텍스트 구성
    const contextBlock = relevant.length > 0
      ? relevant.map((r: any, i: number) =>
          `[${i + 1}] (${r.content_type})\n${r.text_chunk}`
        ).join('\n\n')
      : '관련 정보를 찾을 수 없습니다.';

    const systemPrompt = `${SYSTEM_INSTRUCTIONS[locale as Locale] || SYSTEM_INSTRUCTIONS.ko}

[관련 정보]
${contextBlock}`;

    // 3. Gemini에 전달
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt,
    });

    const geminiHistory = history
      .filter((m: any) => m.role === 'user' || m.role === 'assistant')
      .map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(message);
    const content = result.response.text();

    // 4. 참고 출처 구성
    const sources = relevant.slice(0, 3).map((r: any) => ({
      title: r.metadata?.title || r.content_type,
      type: r.content_type,
      excerpt: r.text_chunk.split('\n').slice(0, 2).join(' ').substring(0, 120),
    }));

    return NextResponse.json({
      id: Date.now().toString(),
      role: 'assistant',
      content,
      sources,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Chat API error:', error?.message);
    const fallback = locale === 'ko'
      ? '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      : locale === 'zh' ? '发生临时错误，请稍后再试。'
      : 'A temporary error occurred. Please try again later.';
    return NextResponse.json({ error: fallback }, { status: 500 });
  }
}
