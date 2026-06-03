'use client';

import { useState, useEffect } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import BilingualInput from '@/components/admin/BilingualInput';
import ContentTable from '@/components/admin/ContentTable';
import type { Research, ResearchKeyTopic } from '@/types/content';

export default function AdminResearchPage() {
  const [items, setItems] = useState<Research[]>([]);
  const [editing, setEditing] = useState<Research | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Key topics state
  const [topics, setTopics] = useState<ResearchKeyTopic[]>([]);
  const [savingTopics, setSavingTopics] = useState(false);
  const [topicsSaved, setTopicsSaved] = useState(false);

  useEffect(() => {
    loadData();
    loadTopics();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch('/api/content?type=research&admin=1');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load research:', error);
    }
  };

  const loadTopics = async () => {
    try {
      const res = await fetch('/api/content?type=settings');
      const data = await res.json();
      setTopics(data?.researchKeyTopics || []);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleAddTopic = () => {
    setTopics(prev => [...prev, { title: { ko: '', en: '', zh: '' } }]);
  };

  const handleTopicChange = (index: number, field: string, value: string) => {
    const langSuffix = ['_ko', '_en', '_zh'].find(s => field.endsWith(s));
    if (!langSuffix) return;
    const lang = langSuffix.slice(1) as 'ko' | 'en' | 'zh';
    setTopics(prev => prev.map((t, i) =>
      i === index ? { title: { ...t.title, [lang]: value } } : t
    ));
  };

  const handleRemoveTopic = (index: number) => {
    setTopics(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveTopics = async () => {
    setSavingTopics(true);
    try {
      const res = await fetch('/api/content?type=settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ researchKeyTopics: topics }),
      });
      if (res.ok) {
        setTopicsSaved(true);
        setTimeout(() => setTopicsSaved(false), 2000);
      }
    } catch (error) {
      console.error('Failed to save topics:', error);
    } finally {
      setSavingTopics(false);
    }
  };

  const emptyItem: Partial<Research> = {
    title: { ko: '', en: '', zh: '' },
    theme: { ko: '', en: '', zh: '' },
    summary: { ko: '', en: '', zh: '' },
    description: { ko: '', en: '', zh: '' },
    keywords: { ko: '', en: '', zh: '' },
    year: new Date().getFullYear(),
    category: '',
    featured: false,
    published: false,
  };

  const [form, setForm] = useState(emptyItem);

  const handleNew = () => { setForm(emptyItem); setEditing(null); setShowForm(true); };

  const handleEdit = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) { setForm(item); setEditing(item); setShowForm(true); }
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => {
      const langSuffix = ['_ko', '_en', '_zh'].find(s => field.endsWith(s));
      if (langSuffix) {
        const baseName = field.slice(0, -langSuffix.length);
        const lang = langSuffix.slice(1);
        const current = (prev as any)[baseName] || { ko: '', en: '' };
        return { ...prev, [baseName]: { ...current, [lang]: value } };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing?.id) {
        const res = await fetch(`/api/content?type=research&id=${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.ok) { await loadData(); setShowForm(false); setEditing(null); }
      } else {
        const res = await fetch('/api/content?type=research', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.ok) { await loadData(); setShowForm(false); }
      }
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('삭제하시겠습니까?')) {
      try {
        const res = await fetch(`/api/content?type=research&id=${id}`, { method: 'DELETE' });
        if (res.ok) await loadData();
      } catch (error) {
        console.error('Failed to delete:', error);
      }
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const item = items.find(i => i.id === id);
      if (item) {
        const res = await fetch(`/api/content?type=research&id=${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...item, published: !item.published }),
        });
        if (res.ok) await loadData();
      }
    } catch (error) {
      console.error('Failed to toggle publish:', error);
    }
  };

  const columns = [
    {
      key: 'title',
      label: '제목',
      render: (value: any) => {
        const v = value as { ko: string };
        return <span className="font-medium">{v?.ko || ''}</span>;
      },
    },
    { key: 'year', label: '연도' },
    { key: 'category', label: '분류' },
    {
      key: 'featured',
      label: '주요',
      render: (value: any) => value ? '★' : '',
    },
  ];

  return (
    <div>
      <AdminPageHeader
        code="RESEARCH"
        title="연구 관리"
        description="연구 항목을 추가, 수정, 삭제합니다"
        action={
          !showForm ? (
            <button onClick={handleNew} className="btn-primary">
              + 새 연구 추가
            </button>
          ) : undefined
        }
      />

      {showForm ? (
        <div className="space-y-6 max-w-4xl">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{editing ? '연구 수정' : '새 연구 추가'}</h2>
            <button onClick={() => setShowForm(false)} className="btn-secondary text-sm">취소</button>
          </div>

          <div className="card space-y-6">
            <BilingualInput
              label="제목"
              nameKo="title_ko" nameEn="title_en" nameZh="title_zh"
              valueKo={(form.title as any)?.ko || ''}
              valueEn={(form.title as any)?.en || ''}
              valueZh={(form.title as any)?.zh || ''}
              onChange={handleChange}
              required
            />
            <BilingualInput
              label="주제"
              nameKo="theme_ko" nameEn="theme_en" nameZh="theme_zh"
              valueKo={(form.theme as any)?.ko || ''}
              valueEn={(form.theme as any)?.en || ''}
              valueZh={(form.theme as any)?.zh || ''}
              onChange={handleChange}
            />
            <BilingualInput
              label="요약"
              nameKo="summary_ko" nameEn="summary_en" nameZh="summary_zh"
              valueKo={(form.summary as any)?.ko || ''}
              valueEn={(form.summary as any)?.en || ''}
              valueZh={(form.summary as any)?.zh || ''}
              onChange={handleChange}
              multiline
              rows={3}
            />
            <BilingualInput
              label="상세 설명"
              nameKo="description_ko" nameEn="description_en" nameZh="description_zh"
              valueKo={(form.description as any)?.ko || ''}
              valueEn={(form.description as any)?.en || ''}
              valueZh={(form.description as any)?.zh || ''}
              onChange={handleChange}
              multiline
              rows={5}
            />
            <BilingualInput
              label="키워드"
              nameKo="keywords_ko" nameEn="keywords_en" nameZh="keywords_zh"
              valueKo={(form.keywords as any)?.ko || ''}
              valueEn={(form.keywords as any)?.en || ''}
              valueZh={(form.keywords as any)?.zh || ''}
              onChange={handleChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">연도</label>
                <input
                  type="number"
                  value={form.year || ''}
                  onChange={e => setForm(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">분류</label>
                <input
                  type="text"
                  value={form.category || ''}
                  onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div className="flex items-end gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured || false}
                    onChange={e => setForm(prev => ({ ...prev, featured: e.target.checked }))}
                  />
                  <span className="text-sm">주요 항목</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.published || false}
                    onChange={e => setForm(prev => ({ ...prev, published: e.target.checked }))}
                  />
                  <span className="text-sm">게시</span>
                </label>
              </div>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? '저장 중...' : '저장하기'}
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Research list */}
          <ContentTable
            columns={columns}
            data={items as any}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onTogglePublish={handleTogglePublish}
          />

          {/* Key Topics editor */}
          <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="mono-xs text-muted-foreground mb-1">// KEY THEMES</p>
                <h2 className="font-semibold">핵심 주제 관리</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  웹사이트 연구 페이지의 '핵심 주제' 섹션에 표시됩니다. 비워두면 각 연구 항목의 '주제' 값이 자동으로 사용됩니다.
                </p>
              </div>
            </div>

            <div className="card space-y-4">
              {topics.length === 0 && (
                <p className="text-sm text-muted-foreground py-2">
                  아직 등록된 핵심 주제가 없습니다. 아래 버튼으로 추가하세요.
                </p>
              )}

              {topics.map((topic, index) => (
                <div key={index} className="border border-border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="mono-xs text-muted-foreground">주제 {index + 1}</span>
                    <button
                      onClick={() => handleRemoveTopic(index)}
                      className="text-xs text-muted-foreground hover:text-foreground border border-border px-2 py-1"
                    >
                      삭제
                    </button>
                  </div>
                  <BilingualInput
                    label=""
                    nameKo={`topic_${index}_ko`}
                    nameEn={`topic_${index}_en`}
                    nameZh={`topic_${index}_zh`}
                    valueKo={topic.title.ko || ''}
                    valueEn={topic.title.en || ''}
                    valueZh={(topic.title as any).zh || ''}
                    onChange={(field, value) => handleTopicChange(index, field, value)}
                  />
                </div>
              ))}

              <button
                onClick={handleAddTopic}
                className="btn-secondary text-sm w-full"
              >
                + 주제 추가
              </button>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={handleSaveTopics}
                disabled={savingTopics}
                className="btn-primary disabled:opacity-50"
              >
                {savingTopics ? '저장 중...' : '핵심 주제 저장'}
              </button>
              {topicsSaved && (
                <span className="text-sm text-green-600">✓ 저장됐습니다</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
