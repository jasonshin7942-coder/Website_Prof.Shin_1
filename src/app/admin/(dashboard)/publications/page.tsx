'use client';

import { useState, useEffect } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import BilingualInput from '@/components/admin/BilingualInput';
import ContentTable from '@/components/admin/ContentTable';
import type { Publication } from '@/types/content';

const categoryOptions = [
  { value: 'journal', label: '학술지' },
  { value: 'conference', label: '학회' },
  { value: 'book', label: '저서' },
  { value: 'chapter', label: '북챕터' },
  { value: 'thesis', label: '학위논문' },
  { value: 'other', label: '기타' },
];

export default function AdminPublicationsPage() {
  const [items, setItems] = useState<Publication[]>([]);
  const [editing, setEditing] = useState<Publication | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch('/api/content?type=publications&admin=1');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load publications:', error);
    }
  };

  const emptyItem: Partial<Publication> = {
    title: { ko: '', en: '', zh: '' },
    abstract: { ko: '', en: '', zh: '' },
    venue: { ko: '', en: '', zh: '' },
    keywords: { ko: '', en: '', zh: '' },
    year: new Date().getFullYear(),
    category: 'journal',
    authors: { ko: '', en: '', zh: '' },
    pdfUrl: '',
    externalUrl: '',
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
        const res = await fetch(`/api/content?type=publications&id=${editing.id}`, {
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
        const res = await fetch('/api/content?type=publications', {
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
        const res = await fetch(`/api/content?type=publications&id=${id}`, {
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
        const res = await fetch(`/api/content?type=publications&id=${id}`, {
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
        return <span className="font-medium max-w-xs truncate block">{v?.ko || ''}</span>;
      },
    },
    {
      key: 'authors',
      label: '저자',
      render: (value: any) => value?.ko || value?.en || '',
    },
    { key: 'year', label: '연도' },
    {
      key: 'category',
      label: '유형',
      render: (value: any) => {
        const opt = categoryOptions.find(o => o.value === value);
        return opt?.label || value;
      },
    },
    {
      key: 'featured',
      label: '주요',
      render: (value: any) => value ? '★' : '',
    },
  ];

  return (
    <div>
      <AdminPageHeader
        code="PUBLICATIONS"
        title="저서·논문 관리"
        description="저서·논문을 추가, 수정, 삭제합니다"
        action={<button onClick={handleNew} className="btn-primary">+ 새 논문 추가</button>}
      />

      {showForm ? (
        <div className="space-y-6 max-w-4xl">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{editing ? '논문 수정' : '새 논문 추가'}</h2>
            <button onClick={() => setShowForm(false)} className="btn-secondary text-sm">취소</button>
          </div>

          <div className="card space-y-6">
            <BilingualInput
              label="제목" nameKo="title_ko" nameEn="title_en" nameZh="title_zh"
              valueKo={(form.title as any)?.ko || ''}
              valueEn={(form.title as any)?.en || ''}
              valueZh={(form.title as any)?.zh || ''}
              onChange={handleChange} required
            />
            <BilingualInput
              label="초록" nameKo="abstract_ko" nameEn="abstract_en" nameZh="abstract_zh"
              valueKo={(form.abstract as any)?.ko || ''}
              valueEn={(form.abstract as any)?.en || ''}
              valueZh={(form.abstract as any)?.zh || ''}
              onChange={handleChange} multiline rows={4}
            />
            <BilingualInput
              label="학회/학술지" nameKo="venue_ko" nameEn="venue_en" nameZh="venue_zh"
              valueKo={(form.venue as any)?.ko || ''}
              valueEn={(form.venue as any)?.en || ''}
              valueZh={(form.venue as any)?.zh || ''}
              onChange={handleChange}
            />
            <BilingualInput
              label="키워드" nameKo="keywords_ko" nameEn="keywords_en" nameZh="keywords_zh"
              valueKo={(form.keywords as any)?.ko || ''}
              valueEn={(form.keywords as any)?.en || ''}
              valueZh={(form.keywords as any)?.zh || ''}
              onChange={handleChange}
            />

            <BilingualInput
              label="저자" nameKo="authors_ko" nameEn="authors_en" nameZh="authors_zh"
              valueKo={(form.authors as any)?.ko || ''}
              valueEn={(form.authors as any)?.en || ''}
              valueZh={(form.authors as any)?.zh || ''}
              onChange={handleChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">연도</label>
                <input type="number" value={form.year || ''} onChange={e => setForm(prev => ({ ...prev, year: parseInt(e.target.value) }))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">유형</label>
                <select value={form.category || ''} onChange={e => setForm(prev => ({ ...prev, category: e.target.value as Publication['category'] }))} className="input-field">
                  {categoryOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">PDF 링크</label>
                <input type="url" value={form.pdfUrl || ''} onChange={e => setForm(prev => ({ ...prev, pdfUrl: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">외부 링크</label>
                <input type="url" value={form.externalUrl || ''} onChange={e => setForm(prev => ({ ...prev, externalUrl: e.target.value }))} className="input-field" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured || false} onChange={e => setForm(prev => ({ ...prev, featured: e.target.checked }))} />
                <span className="text-sm">주요 논문</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.published || false} onChange={e => setForm(prev => ({ ...prev, published: e.target.checked }))} />
                <span className="text-sm">게시</span>
              </label>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">{saving ? '저장 중...' : '저장하기'}</button>
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
