import { NextRequest, NextResponse } from 'next/server';

// Placeholder for future RAG-based chat API
// Will integrate with:
// - Vector database for content embeddings
// - LLM API for generating responses
// - Content from admin-managed sources
// - Chatbot source documents

export async function POST(request: NextRequest) {
  const { message, locale = 'ko' } = await request.json();

  if (!message) {
    return NextResponse.json({ error: 'Message required' }, { status: 400 });
  }

  // Simulated response - replace with real RAG pipeline
  const response = {
    id: Date.now().toString(),
    role: 'assistant',
    content: locale === 'ko'
      ? '이 기능은 현재 개발 중입니다. 곧 AI 기반 답변 시스템이 연결될 예정입니다.'
      : 'This feature is currently under development. An AI-based response system will be connected soon.',
    sources: [],
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
