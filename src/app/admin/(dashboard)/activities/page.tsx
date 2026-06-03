'use client';

import { useState, useEffect } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import BilingualInput from '@/components/admin/BilingualInput';
import ContentTable from '@/components/admin/ContentTable';
import ImageUpload from '@/components/admin/ImageUpload';
import type { Activity } from '@/types/content';

const typeOptions = [
  { value: 'conference', label: '학술대회' },
  { value: 'talk', label: '강연' },
  { value: 'workshop', label: '워크숍' },
  { value: 'exhibition', label: '전시' },
  { value: 'collaboration', label: '협업' },
  { value: 'exchange', label: '교류' },
  { value: 'other', label: '기타' },
];

export default function AdminActivitiesPage() {
  const [items, setItems] = useState<Activity[]>([]);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch('/api/content?type=activities&admin=1');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load activities:', error);
    }
  };

  const emptyItem: Partial<Activity> = {
    title: { ko: '', en: '', zh: '' },
    summary: { ko: '', en: '', zh: '' },
    description: { ko: '', en: '', zh: '' },
    location: { ko: '', en: '', zh: '' },
    type: 'conference',
    date: '',
    relatedLink: '',
    imageUrl: '',
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
        const res = await fetch(`/api/content?type=activities&id=${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.ok) { await loadData(); setShowForm(false); setEditing(null); }
      } else {
        const res = await fetch('/api/content?type=activities', {
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
        const res = await fetch(`/api/content?type=activities&id=${id}`, { method: 'DELETE' });
        if (res.ok) await loadData();
      } catch (error) { console.error('Failed to delete:', error); }
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const item = items.find(i => i.id === id);
      if (item) {
        const res = await fetch(`/api/content?type=activities&id=${id}`, {
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
      label: '제목',
      render: (value: any) => {
        const v = value as { ko: string };
        return <span className="font-medium">{v?.ko || ''}</span>;
      },
    },
    {
      key: 'type',
      label: '유형',
      render: (value: any) => typeOptions.find(o => o.value === value)?.label || value,
    },
    { key: 'date', label: '날짜' },
    {
      key: 'location',
      label: '장소',
      render: (value: any) => {
        const v = value as { ko: string };
        return v?.ko || '';
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
        code="ACTIVITIES"
        title="활동 관리"
        description="학술·문화 활동을 관리합니다"
        action={<button onClick={handleNew} className="btn-primary">+ 새 활동 추가</button>}
      />

      {showForm ? (
        <div className="space-y-6 max-w-4xl">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{editing ? '활동 수정' : '새 활동 추가'}</h2>
            <button onClick={() => setShowForm(false)} className="btn-secondary text-sm">취소</button>
          </div>

          <div className="card space-y-6">
            <BilingualInput label="제목" nameKo="title_ko" nameEn="title_en" nameZh="title_zh"
              valueKo={(form.title as any)?.ko || ''} valueEn={(form.title as any)?.en || ''} valueZh={(form.title as any)?.zh || ''}
              onChange={handleChange} required />
            <BilingualInput label="장소" nameKo="location_ko" nameEn="location_en" nameZh="location_zh"
              valueKo={(form.location as any)?.ko || ''} valueEn={(form.location as any)?.en || ''} valueZh={(form.location as any)?.zh || ''}
              onChange={handleChange} />
            <BilingualInput label="요약" nameKo="summary_ko" nameEn="summary_en" nameZh="summary_zh"
              valueKo={(form.summary as any)?.ko || ''} valueEn={(form.summary as any)?.en || ''} valueZh={(form.summary as any)?.zh || ''}
              onChange={handleChange} multiline rows={3} />
            <BilingualInput label="상세 설명" nameKo="description_ko" nameEn="description_en" nameZh="description_zh"
              valueKo={(form.description as any)?.ko || ''} valueEn={(form.description as any)?.en || ''} valueZh={(form.description as any)?.zh || ''}
              onChange={handleChange} multiline rows={5} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">유형</label>
                <select value={form.type || ''} onChange={e => setForm(prev => ({ ...prev, type: e.target.value as Activity['type'] }))} className="input-field">
                  {typeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">날짜</label>
                <input type="date" value={form.date || ''} onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">관련 링크</label>
                <input type="url" value={form.relatedLink || ''} onChange={e => setForm(prev => ({ ...prev, relatedLink: e.target.value }))} className="input-field" />
              </div>
            </div>

            <ImageUpload
              label="활동 이미지"
              value={form.imageUrl || ''}
              onChange={url => setForm(prev => ({ ...prev, imageUrl: url }))}
            />

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured || false} onChange={e => setForm(prev => ({ ...prev, featured: e.target.checked }))} />
                <span className="text-sm">주요 활동</span>
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
