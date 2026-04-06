'use client';

import { useState, useEffect } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import BilingualInput from '@/components/admin/BilingualInput';
import ContentTable from '@/components/admin/ContentTable';
import type { Teaching } from '@/types/content';

const categoryOptions = [
  { value: 'undergraduate', label: '학부' },
  { value: 'graduate', label: '대학원' },
  { value: 'workshop', label: '워크숍' },
  { value: 'seminar', label: '세미나' },
  { value: 'other', label: '기타' },
];

export default function AdminTeachingPage() {
  const [items, setItems] = useState<Teaching[]>([]);
  const [editing, setEditing] = useState<Teaching | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch('/api/content?type=teaching');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load teaching:', error);
    }
  };

  const emptyItem: Partial<Teaching> = {
    title: { ko: '', en: '' },
    summary: { ko: '', en: '' },
    description: { ko: '', en: '' },
    keywords: { ko: '', en: '' },
    category: 'undergraduate',
    semester: '',
    courseType: '',
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
        const res = await fetch(`/api/content?type=teaching&id=${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.ok) { await loadData(); setShowForm(false); setEditing(null); }
      } else {
        const res = await fetch('/api/content?type=teaching', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.ok) { await loadData(); setShowForm(false); }
      }
    } catch (error) { console.error('Failed to save:', error); }
    finally { setSaving(false); }
  };
  const handleDelete = async (id: string) => {
    if (confirm('삭제하시겠습니까?')) {
      try {
        const res = await fetch(`/api/content?type=teaching&id=${id}`, { method: 'DELETE' });
        if (res.ok) await loadData();
      } catch (error) { console.error('Failed to delete:', error); }
    }
  };
  const handleTogglePublish = async (id: string) => {
    try {
      const item = items.find(i => i.id === id);
      if (item) {
        const res = await fetch(`/api/content?type=teaching&id=${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...item, published: !item.published }),
        });
        if (res.ok) await loadData();
      }
    } catch (error) { console.error('Failed to toggle publish:', error); }
  };

  const columns = [
    {
      key: 'title',
      label: '강의명',
      render: (value: any) => {
        const v = value as { ko: string };
        return <span className="font-medium">{v?.ko || ''}</span>;
      },
    },
    {
      key: 'category',
      label: '유형',
      render: (value: any) => categoryOptions.find(o => o.value === value)?.label || value,
    },
    { key: 'semester', label: '학기' },
    { key: 'courseType', label: '구분' },
    {
      key: 'featured',
      label: '주요',
      render: (value: any) => value ? '★' : '',
    },
  ];

  return (
    <div>
      <AdminPageHeader
        code="TEACHING"
        title="교육 관리"
        description="강의 및 교육 콘텐츠를 관리합니다"
        action={<button onClick={handleNew} className="btn-primary">+ 새 강의 추가</button>}
      />

      {showForm ? (
        <div className="space-y-6 max-w-4xl">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{editing ? '강의 수정' : '새 강의 추가'}</h2>
            <button onClick={() => setShowForm(false)} className="btn-secondary text-sm">취소</button>
          </div>

          <div className="card space-y-6">
            <BilingualInput label="강의명" nameKo="title_ko" nameEn="title_en"
              valueKo={(form.title as any)?.ko || ''} valueEn={(form.title as any)?.en || ''}
              onChange={handleChange} required />
            <BilingualInput label="요약" nameKo="summary_ko" nameEn="summary_en"
              valueKo={(form.summary as any)?.ko || ''} valueEn={(form.summary as any)?.en || ''}
              onChange={handleChange} multiline rows={3} />
            <BilingualInput label="상세 설명" nameKo="description_ko" nameEn="description_en"
              valueKo={(form.description as any)?.ko || ''} valueEn={(form.description as any)?.en || ''}
              onChange={handleChange} multiline rows={5} />
            <BilingualInput label="키워드" nameKo="keywords_ko" nameEn="keywords_en"
              valueKo={(form.keywords as any)?.ko || ''} valueEn={(form.keywords as any)?.en || ''}
              onChange={handleChange} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">유형</label>
                <select value={form.category || ''} onChange={e => setForm(prev => ({ ...prev, category: e.target.value as Teaching['category'] }))} className="input-field">
                  {categoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">학기</label>
                <input type="text" value={form.semester || ''} onChange={e => setForm(prev => ({ ...prev, semester: e.target.value }))} className="input-field" placeholder="예: 2024 Spring" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">구분</label>
                <input type="text" value={form.courseType || ''} onChange={e => setForm(prev => ({ ...prev, courseType: e.target.value }))} className="input-field" placeholder="예: 전공필수" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured || false} onChange={e => setForm(prev => ({ ...prev, featured: e.target.checked }))} />
                <span className="text-sm">주요 강의</span>
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
        <ContentTable columns={columns} data={items as any} onEdit={handleEdit} onDelete={handleDelete} onTogglePublish={handleTogglePublish} />
      )}
    </div>
  );
}
