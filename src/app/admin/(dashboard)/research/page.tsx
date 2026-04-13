'use client';

import { useState, useEffect } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import BilingualInput from '@/components/admin/BilingualInput';
import ContentTable from '@/components/admin/ContentTable';
import { showToast } from '@/components/admin/Toast';
import type { Research, ResearchKeyTopic } from '@/types/content';

const defaultKeyTopics: ResearchKeyTopic[] = [
  { title: { ko: '', en: '' } },
  { title: { ko: '', en: '' } },
  { title: { ko: '', en: '' } },
];

export default function AdminResearchPage() {
  const [items, setItems] = useState<Research[]>([]);
  const [editing, setEditing] = useState<Research | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [keyTopics, setKeyTopics] = useState<ResearchKeyTopic[]>(defaultKeyTopics);
  const [showKeyTopics, setShowKeyTopics] = useState(false);
  const [savingKeyTopics, setSavingKeyTopics] = useState(false);

  useEffect(() => {
    loadData();
    loadKeyTopics();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch('/api/content?type=research');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load research:', error);
    }
  };

  const loadKeyTopics = async () => {
    try {
      const res = await fetch('/api/content?type=settings');
      const data = await res.json();
      if (data?.researchKeyTopics?.length) {
        setKeyTopics(data.researchKeyTopics);
      }
    } catch (error) {
      console.error('Failed to load key topics:', error);
    }
  };

  const handleSaveKeyTopics = async () => {
    setSavingKeyTopics(true);
    try {
      const settingsRes = await fetch('/api/content?type=settings');
      const settings = await settingsRes.json();
      const res = await fetch('/api/content?type=settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, researchKeyTopics: keyTopics }),
      });
      if (res.ok) {
        showToast('success', '핵심 주제가 저장되었습니다');
      } else {
        showToast('error', '저장에 실패했습니다');
      }
    } catch (error) {
      console.error('Failed to save key topics:', error);
      showToast('error', '저장 중 오류가 발생했습니다');
    } finally {
      setSavingKeyTopics(false);
    }
  };

  const handleKeyTopicChange = (index: number, lang: 'ko' | 'en', value: string) => {
    setKeyTopics(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], title: { ...updated[index].title, [lang]: value } };
      return updated;
    });
  };

  const emptyItem: Partial<Research> = {
    title: { ko: '', en: '' },
    theme: { ko: '', en: '' },
    summary: { ko: '', en: '' },
    description: { ko: '', en: '' },
    keywords: { ko: '', en: '' },
    year: new Date().getFullYear(),
    category: '',
    featured: false,
    published: false,
  };

  const [form, setForm] = useState(emptyItem);

  const handleNew = () => {
    setForm(emptyItem);
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      setForm(item);
      setEditing(item);
      setShowForm(true);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => {
      if (field.includes('_ko') || field.includes('_en')) {
        const baseName = field.replace('_ko', '').replace('_en', '');
        const lang = field.endsWith('_ko') ? 'ko' : 'en';
        const current = (prev as any)[baseName] as { ko: string; en: string } || { ko: '', en: '' };
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
        if (res.ok) {
          await loadData();
          setShowForm(false);
          setEditing(null);
        }
      } else {
        const res = await fetch('/api/content?type=research', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          await loadData();
          setShowForm(false);
        }
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
        const res = await fetch(`/api/content?type=research&id=${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          await loadData();
        }
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
        if (res.ok) {
          await loadData();
        }
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
          <button onClick={handleNew} className="btn-primary">
            + 새 연구 추가
          </button>
        }
      />

      {/* Key Topics Editor */}
      <div className="mb-8 max-w-4xl">
        <button
          onClick={() => setShowKeyTopics(!showKeyTopics)}
          className="btn-secondary text-sm mb-4"
        >
          {showKeyTopics ? '▲ 핵심 주제 편집 닫기' : '▼ 핵심 주제 편집'}
        </button>

        {showKeyTopics && (
          <div className="space-y-6">
            <div className="card space-y-6">
              <h3 className="font-semibold text-sm">핵심 주제 (연구 페이지 상단에 표시)</h3>
              {keyTopics.map((topic, i) => (
                <div key={i} className="border border-border p-4 space-y-3">
                  <p className="mono-xs text-muted-foreground">핵심 주제 {i + 1}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">한국어</label>
                      <input type="text" value={topic.title.ko} onChange={e => handleKeyTopicChange(i, 'ko', e.target.value)} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">English</label>
                      <input type="text" value={topic.title.en} onChange={e => handleKeyTopicChange(i, 'en', e.target.value)} className="input-field" />
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-3">
                <button
                  onClick={() => setKeyTopics(prev => [...prev, { title: { ko: '', en: '' } }])}
                  className="btn-secondary text-sm"
                >
                  + 주제 추가
                </button>
                {keyTopics.length > 1 && (
                  <button
                    onClick={() => setKeyTopics(prev => prev.slice(0, -1))}
                    className="btn-secondary text-sm text-danger"
                  >
                    마지막 주제 삭제
                  </button>
                )}
              </div>
            </div>

            <button onClick={handleSaveKeyTopics} disabled={savingKeyTopics} className="btn-primary disabled:opacity-50">
              {savingKeyTopics ? '저장 중...' : '핵심 주제 저장'}
            </button>
          </div>
        )}
      </div>

      {showForm ? (
        <div className="space-y-6 max-w-4xl">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{editing ? '연구 수정' : '새 연구 추가'}</h2>
            <button onClick={() => setShowForm(false)} className="btn-secondary text-sm">취소</button>
          </div>

          <div className="card space-y-6">
            <BilingualInput
              label="제목"
              nameKo="title_ko" nameEn="title_en"
              valueKo={(form.title as any)?.ko || ''}
              valueEn={(form.title as any)?.en || ''}
              onChange={handleChange}
              required
            />
            <BilingualInput
              label="주제"
              nameKo="theme_ko" nameEn="theme_en"
              valueKo={(form.theme as any)?.ko || ''}
              valueEn={(form.theme as any)?.en || ''}
              onChange={handleChange}
            />
            <BilingualInput
              label="요약"
              nameKo="summary_ko" nameEn="summary_en"
              valueKo={(form.summary as any)?.ko || ''}
              valueEn={(form.summary as any)?.en || ''}
              onChange={handleChange}
              multiline
              rows={3}
            />
            <BilingualInput
              label="상세 설명"
              nameKo="description_ko" nameEn="description_en"
              valueKo={(form.description as any)?.ko || ''}
              valueEn={(form.description as any)?.en || ''}
              onChange={handleChange}
              multiline
              rows={5}
            />
            <BilingualInput
              label="키워드"
              nameKo="keywords_ko" nameEn="keywords_en"
              valueKo={(form.keywords as any)?.ko || ''}
              valueEn={(form.keywords as any)?.en || ''}
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
        <ContentTable
          columns={columns}
          data={items as any}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTogglePublish={handleTogglePublish}
        />
      )}
    </div>
  );
}
