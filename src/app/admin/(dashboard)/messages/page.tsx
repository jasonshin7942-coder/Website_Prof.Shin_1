'use client';

import { useState, useEffect } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import type { ContactMessage } from '@/types/content';

const inquiryLabels: Record<string, string> = {
  collaboration: '공동 연구',
  invitation: '초청 강연',
  student: '학생 상담',
  media: '미디어 문의',
  general: '일반 문의',
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadMessages(); }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = async (msg: ContactMessage) => {
    setSelected(msg);
    if (!msg.read) {
      await fetch(`/api/messages?id=${msg.id}`, { method: 'PUT' });
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('이 메시지를 삭제하시겠습니까?')) return;
    await fetch(`/api/messages?id=${id}`, { method: 'DELETE' });
    if (selected?.id === id) setSelected(null);
    await loadMessages();
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div>
      <AdminPageHeader
        code="MESSAGES"
        title="메시지함"
        description="연락하기 페이지를 통해 수신된 메시지를 확인합니다"
      />

      {loading ? (
        <p className="text-sm text-muted-foreground">불러오는 중...</p>
      ) : messages.length === 0 ? (
        <div className="card text-center py-16">
          <p className="font-mono text-4xl text-muted-foreground/20 mb-4">✉</p>
          <p className="text-muted-foreground text-sm">수신된 메시지가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Message list */}
          <div>
            {unreadCount > 0 && (
              <p className="mono-xs text-muted-foreground mb-3">
                읽지 않은 메시지 <span className="text-foreground font-semibold">{unreadCount}개</span>
              </p>
            )}
            <div className="border border-border divide-y divide-border">
              {messages.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => handleOpen(msg)}
                  className={`w-full text-left px-4 py-3 hover:bg-muted/40 transition-colors ${
                    selected?.id === msg.id ? 'bg-muted/60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {!msg.read && (
                        <span className="w-1.5 h-1.5 bg-foreground rounded-full shrink-0 mt-1.5" />
                      )}
                      <div className="min-w-0">
                        <p className={`text-sm truncate ${!msg.read ? 'font-semibold' : ''}`}>
                          {msg.subject}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {msg.name} · {msg.email}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="mono-xs text-muted-foreground">
                        {new Date(msg.createdAt).toLocaleDateString('ko-KR')}
                      </p>
                      <p className="mono-xs text-muted-foreground">
                        {inquiryLabels[msg.inquiryType] || msg.inquiryType}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message detail */}
          <div>
            {selected ? (
              <div className="card space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-semibold text-base">{selected.subject}</h2>
                    <p className="mono-xs text-muted-foreground mt-1">
                      {new Date(selected.createdAt).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="mono-xs px-2 py-1 border border-danger text-danger hover:bg-danger hover:text-white shrink-0"
                  >
                    삭제
                  </button>
                </div>

                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex gap-3 text-sm">
                    <span className="text-muted-foreground w-20 shrink-0">보낸 사람</span>
                    <span className="font-medium">{selected.name}</span>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <span className="text-muted-foreground w-20 shrink-0">이메일</span>
                    <a href={`mailto:${selected.email}`} className="font-medium hover:underline underline-offset-4">
                      {selected.email}
                    </a>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <span className="text-muted-foreground w-20 shrink-0">문의 유형</span>
                    <span>{inquiryLabels[selected.inquiryType] || selected.inquiryType}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>

                <div className="border-t border-border pt-4">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                    className="btn-primary text-sm inline-block"
                  >
                    답장 보내기 →
                  </a>
                </div>
              </div>
            ) : (
              <div className="border border-border p-12 text-center">
                <p className="text-muted-foreground text-sm">메시지를 선택하면 내용이 표시됩니다.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
