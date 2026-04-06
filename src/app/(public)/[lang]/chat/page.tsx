'use client';

import { useState, useRef, useEffect } from 'react';
import { getDictionary } from '@/i18n/dictionaries';
import type { ChatMessage, ChatSource } from '@/types/content';
import type { Locale } from '@/i18n/config';
import { useParams } from 'next/navigation';

export default function ChatPage() {
  const params = useParams();
  const locale = (params.lang as string) as Locale;
  const dict = getDictionary(locale);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = locale === 'ko'
    ? [
        '주요 연구 분야는 무엇인가요?',
        'AI와 예술의 융합 연구에 대해 알려주세요.',
        '대표 강의는 어떤 것이 있나요?',
        '최근 학술 활동은 어떤 것이 있나요?',
      ]
    : [
        'What are the main research areas?',
        'Tell me about the AI and art convergence research.',
        'What are the representative courses?',
        'What are the recent academic activities?',
      ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const message = text || input;
    if (!message.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simulated AI response - will be replaced with real API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockSources: ChatSource[] = [
      {
        title: locale === 'ko' ? 'AI 기반 디지털 미디어 아트 창작 연구' : 'AI-Based Digital Media Art Creation Research',
        type: 'research',
        excerpt: locale === 'ko'
          ? '생성형 AI 기술을 활용한 새로운 형태의 디지털 미디어 아트 창작 방법론...'
          : 'New methodologies for digital media art creation utilizing generative AI technology...',
      },
      {
        title: locale === 'ko' ? '생성형 AI를 활용한 디지털 미디어 아트 창작 방법론 연구' : 'A Study on Digital Media Art Creation Methodology Using Generative AI',
        type: 'publication',
        excerpt: locale === 'ko'
          ? '본 연구는 생성형 AI 기술, 특히 GAN과 Diffusion Model을 활용한...'
          : 'This study proposes a new creative methodology for digital media art...',
      },
    ];

    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: locale === 'ko'
        ? `신종천 교수의 연구에 대한 질문을 주셨네요. 관련된 정보를 찾았습니다.\n\n신종천 교수는 인공지능, 예술, 문화의 교차점에서 기술과 인문학의 창조적 융합을 연구하고 있습니다. 특히 생성형 AI를 활용한 디지털 미디어 아트 창작, 문화콘텐츠 내러티브 생성, 융합 예술 교육 등이 주요 연구 분야입니다.\n\n이 답변은 데모 응답입니다. 실제 AI 백엔드 연결 후 RAG 기반의 정확한 답변이 제공될 예정입니다.`
        : `Thank you for your question about Professor Shin's research. Here's what I found.\n\nProfessor Jongcheon Shin researches the creative convergence of technology and humanities at the intersection of AI, art, and culture. Key research areas include digital media art creation using generative AI, cultural content narrative generation, and convergence art education.\n\nThis is a demo response. Accurate RAG-based answers will be provided after connecting to the actual AI backend.`,
      sources: mockSources,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, assistantMsg]);
    setLoading(false);
  };

  return (
    <>
      {/* Hero */}
      <section className="py-12 border-b border-border">
        <div className="container-wide">
          <p className="mono-xs text-muted-foreground mb-3">// AI ASSISTANT</p>
          <h1 className="heading-lg mb-2">{dict.chat.title}</h1>
          <p className="body-md text-muted-foreground">{dict.chat.subtitle}</p>
        </div>
      </section>

      <div className="container-wide py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat area */}
          <div className="lg:col-span-2">
            <div className="border border-border bg-card min-h-[500px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[600px]">
                {messages.length === 0 && (
                  <div className="text-center py-20">
                    <p className="font-mono text-6xl text-muted-foreground/10 mb-6">AI</p>
                    <p className="text-muted-foreground">{dict.chat.empty}</p>
                  </div>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${
                      msg.role === 'user'
                        ? 'bg-foreground text-background p-4'
                        : 'bg-muted p-4'
                    }`}>
                      {msg.role === 'assistant' && (
                        <p className="mono-xs text-muted-foreground mb-2">AI ASSISTANT</p>
                      )}
                      <p className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</p>

                      {/* Sources */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-border">
                          <p className="mono-xs text-muted-foreground mb-2">{dict.chat.sources}</p>
                          <div className="space-y-2">
                            {msg.sources.map((src, i) => (
                              <div key={i} className="text-xs bg-background/50 p-2 border border-border">
                                <p className="font-semibold">{src.title}</p>
                                <p className="text-muted-foreground mt-1">{src.excerpt}</p>
                                <span className="mono-xs text-muted-foreground">{src.type}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-4">
                      <p className="mono-xs text-muted-foreground animate-pulse">{dict.chat.thinking}</p>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-border p-4">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex gap-3"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={dict.chat.placeholder}
                    className="input-field flex-1"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="btn-primary disabled:opacity-40"
                  >
                    {dict.chat.send}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Suggested questions */}
            <div className="border border-border p-6">
              <p className="mono-xs text-muted-foreground mb-4">{dict.chat.suggestedQuestions}</p>
              <div className="space-y-2">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    disabled={loading}
                    className="w-full text-left text-sm p-3 border border-border hover:border-foreground transition-colors disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="border border-border p-6 bg-muted/30">
              <p className="mono-xs text-muted-foreground mb-3">// INFO</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {locale === 'ko'
                  ? 'AI 어시스턴트는 신종천 교수의 연구, 교육, 활동, 저서·논문 정보를 바탕으로 답변합니다. 응답은 참고용이며, 정확한 정보는 직접 확인해 주세요.'
                  : 'The AI assistant answers based on Professor Shin\'s research, teaching, activities, and publication information. Responses are for reference; please verify for accuracy.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
