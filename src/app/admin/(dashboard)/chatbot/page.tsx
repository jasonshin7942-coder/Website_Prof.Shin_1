'use client';

import { useState } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

interface ChatbotSource {
  id: string;
  title: string;
  fileName: string;
  fileType: string;
  sourceType: string;
  active: boolean;
  indexed: boolean;
  uploadedAt: string;
}

const mockSources: ChatbotSource[] = [
  { id: '1', title: '교수 프로필 데이터', fileName: 'profile-data.json', fileType: 'JSON', sourceType: 'profile', active: true, indexed: true, uploadedAt: '2024-12-01' },
  { id: '2', title: '연구 데이터', fileName: 'research-data.json', fileType: 'JSON', sourceType: 'research', active: true, indexed: true, uploadedAt: '2024-12-01' },
  { id: '3', title: '논문 데이터', fileName: 'publications-data.json', fileType: 'JSON', sourceType: 'publication', active: true, indexed: true, uploadedAt: '2024-12-01' },
  { id: '4', title: '추가 연구 자료', fileName: 'supplementary-docs.pdf', fileType: 'PDF', sourceType: 'document', active: false, indexed: false, uploadedAt: '2024-11-15' },
];

const sourceTypeLabels: Record<string, string> = {
  profile: '프로필',
  research: '연구',
  publication: '논문',
  teaching: '교육',
  activity: '활동',
  document: '문서',
};

export default function AdminChatbotPage() {
  const [sources, setSources] = useState<ChatbotSource[]>(mockSources);

  const toggleActive = (id: string) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const handleReindex = (id: string) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, indexed: false } : s));
    // Simulate reindexing
    setTimeout(() => {
      setSources(prev => prev.map(s => s.id === id ? { ...s, indexed: true } : s));
    }, 2000);
  };

  const handleReindexAll = () => {
    setSources(prev => prev.map(s => ({ ...s, indexed: false })));
    setTimeout(() => {
      setSources(prev => prev.map(s => ({ ...s, indexed: true })));
    }, 3000);
  };

  const handleDelete = (id: string) => {
    if (confirm('이 소스를 삭제하시겠습니까?')) {
      setSources(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div>
      <AdminPageHeader
        code="CHATBOT"
        title="챗봇 소스 관리"
        description="AI 챗봇이 참조하는 소스 문서를 관리합니다"
        action={
          <div className="flex gap-2">
            <button onClick={handleReindexAll} className="btn-secondary">전체 재인덱싱</button>
            <button className="btn-primary">+ 소스 추가</button>
          </div>
        }
      />

      {/* Info */}
      <div className="card bg-muted/30 mb-8">
        <p className="mono-xs text-muted-foreground mb-2">// 챗봇 정보</p>
        <p className="text-sm text-muted-foreground">
          AI 챗봇은 활성화된 소스 문서를 바탕으로 답변을 생성합니다. 소스를 추가하거나 제거하면 챗봇의 답변 범위가 변경됩니다.
          재인덱싱을 수행하면 최신 데이터가 챗봇에 반영됩니다.
        </p>
        <div className="mt-3 flex gap-4 text-sm">
          <span>활성 소스: <strong>{sources.filter(s => s.active).length}</strong></span>
          <span>인덱싱 완료: <strong>{sources.filter(s => s.indexed).length}</strong></span>
          <span>총 소스: <strong>{sources.length}</strong></span>
        </div>
      </div>

      {/* Source list */}
      <div className="space-y-3">
        {sources.map(source => (
          <div key={source.id} className="card flex items-center gap-4">
            {/* Status indicator */}
            <div className={`w-2 h-2 rounded-full shrink-0 ${
              source.active && source.indexed ? 'bg-success' :
              source.active && !source.indexed ? 'bg-warning' :
              'bg-muted-foreground/30'
            }`} />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm">{source.title}</h3>
              <div className="flex items-center gap-3 mt-1 mono-xs text-muted-foreground">
                <span>{source.fileName}</span>
                <span>{source.fileType}</span>
                <span>{sourceTypeLabels[source.sourceType] || source.sourceType}</span>
                <span>{source.uploadedAt}</span>
              </div>
            </div>

            {/* Status badges */}
            <div className="flex items-center gap-2 shrink-0">
              <span className={`mono-xs px-2 py-0.5 border ${
                source.indexed ? 'border-success text-success' : 'border-warning text-warning'
              }`}>
                {source.indexed ? '인덱싱 완료' : '인덱싱 중...'}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleActive(source.id)}
                className={`mono-xs px-2 py-0.5 border ${
                  source.active ? 'border-foreground text-foreground' : 'border-border text-muted-foreground'
                }`}
              >
                {source.active ? '활성' : '비활성'}
              </button>
              <button
                onClick={() => handleReindex(source.id)}
                className="mono-xs px-2 py-0.5 border border-border text-muted-foreground hover:border-foreground"
              >
                재인덱싱
              </button>
              <button
                onClick={() => handleDelete(source.id)}
                className="mono-xs px-2 py-0.5 border border-danger text-danger hover:bg-danger hover:text-white"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload area */}
      <div className="mt-8 border-2 border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground mb-2">새 소스 문서를 드래그하거나 클릭하여 업로드</p>
        <p className="mono-xs text-muted-foreground mb-4">PDF, JSON, TXT, DOCX · 최대 20MB</p>
        <button className="btn-secondary">파일 선택</button>
      </div>
    </div>
  );
}
