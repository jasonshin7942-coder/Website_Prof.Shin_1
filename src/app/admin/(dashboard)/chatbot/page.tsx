'use client';

import { useState, useEffect } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

interface EmbeddingStats {
  total: number;
  byType: Record<string, number>;
  byLocale: Record<string, number>;
  lastUpdated: string | null;
}

export default function AdminChatbotPage() {
  const [stats, setStats] = useState<EmbeddingStats | null>(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [done, setDone] = useState(false);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const res = await fetch('/api/embeddings');
      const data = await res.json();
      setStats(data);
    } catch { setStats(null); }
  };

  const handleGenerate = async () => {
    if (!confirm('모든 콘텐츠의 임베딩을 재생성합니다. 1~2분 정도 소요될 수 있습니다. 계속하시겠습니까?')) return;
    setGenerating(true);
    setProgress('임베딩 생성 중...');
    setDone(false);

    try {
      const res = await fetch('/api/embeddings', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setProgress(`✓ ${data.count}개 임베딩 생성 완료`);
        setDone(true);
        await loadStats();
      } else {
        setProgress(`❌ 오류: ${data.error}`);
      }
    } catch {
      setProgress('❌ 네트워크 오류가 발생했습니다.');
    } finally {
      setGenerating(false);
    }
  };

  const typeLabels: Record<string, string> = {
    profile: '프로필', research: '연구', publication: '논문·저서',
    teaching: '강의', activity: '활동',
  };
  const localeLabels: Record<string, string> = { ko: '한국어', en: 'English', zh: '中文' };

  return (
    <div>
      <AdminPageHeader
        code="CHATBOT"
        title="챗봇 소스 관리"
        description="AI 채팅이 참조하는 임베딩 데이터를 관리합니다"
      />

      {/* Info */}
      <div className="card bg-muted/30 mb-8 max-w-3xl">
        <p className="mono-xs text-muted-foreground mb-2">// RAG 구조</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          AI 채팅은 방문자의 질문을 벡터로 변환한 후 Supabase에 저장된 교수님 콘텐츠 임베딩과 유사도를 계산해,
          가장 관련성 높은 내용을 찾아 Gemini에게 전달합니다.
          콘텐츠를 추가·수정한 후에는 <strong>임베딩 재생성</strong>을 실행해 최신 내용이 반영되도록 하세요.
        </p>
      </div>

      {/* Stats */}
      <div className="max-w-3xl mb-8">
        <p className="mono-xs text-muted-foreground mb-3">// 임베딩 현황</p>
        {stats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="card text-center">
              <p className="font-mono text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground mt-1">전체 임베딩</p>
            </div>
            {Object.entries(stats.byLocale).map(([locale, count]) => (
              <div key={locale} className="card text-center">
                <p className="font-mono text-2xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground mt-1">{localeLabels[locale] || locale}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="card bg-muted/30">
            <p className="text-sm text-muted-foreground">
              임베딩이 아직 생성되지 않았습니다. 아래 버튼을 클릭해 생성하세요.
            </p>
          </div>
        )}

        {stats?.byType && (
          <div className="border border-border divide-y divide-border">
            {Object.entries(stats.byType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between px-4 py-2 text-sm">
                <span className="text-muted-foreground">{typeLabels[type] || type}</span>
                <span className="font-medium">{count}개</span>
              </div>
            ))}
          </div>
        )}

        {stats?.lastUpdated && (
          <p className="text-xs text-muted-foreground mt-2">
            마지막 업데이트: {new Date(stats.lastUpdated).toLocaleString('ko-KR')}
          </p>
        )}
      </div>

      {/* Generate button */}
      <div className="max-w-3xl">
        <p className="mono-xs text-muted-foreground mb-3">// 임베딩 재생성</p>
        <p className="text-sm text-muted-foreground mb-4">
          콘텐츠(연구·논문·강의·활동·프로필)를 수정한 후 실행하세요.
          한국어·영어·중문 전체 임베딩을 새로 생성합니다.
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="btn-primary disabled:opacity-50"
          >
            {generating ? '생성 중...' : '임베딩 재생성'}
          </button>
          {progress && (
            <span className={`text-sm ${done ? 'text-green-600' : 'text-muted-foreground'}`}>
              {progress}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
