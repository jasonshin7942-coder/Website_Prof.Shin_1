'use client';

import { useState, useEffect } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import BilingualInput from '@/components/admin/BilingualInput';
import ContentTable from '@/components/admin/ContentTable';
import type { Teaching, TeachingPhilosophy, BilingualText } from '@/types/content';

const categoryOptions = [
  { value: 'undergraduate', label: '학부' },
  { value: 'graduate', label: '대학원' },
  { value: 'workshop', label: '워크숍' },
  { value: 'seminar', label: '세미나' },
  { value: 'other', label: '기타' },
];

const emptyPhilosophy: TeachingPhilosophy = {
  paragraph1: { ko: '', en: '', zh: '' },
  paragraph2: { ko: '', en: '', zh: '' },
  principles: [],
};

export default function AdminTeachingPage() {
  const [items, setItems] = useState<Teaching[]>([]);
  const [editing, setEditing] = useState<Teaching | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Section title state
  const [coursesTitle, setCoursesTitle] = useState<BilingualText>({ ko: '', en: '', zh: '' });
  const [savingTitle, setSavingTitle] = useState(false);
  const [titleSaved, setTitleSaved] = useState(false);

  // Teaching philosophy state
  const [phil, setPhil] = useState<TeachingPhilosophy>(emptyPhilosophy);
  const [savingPhil, setSavingPhil] = useState(false);
  const [philSaved, setPhilSaved] = useState(false);

  useEffect(() => {
    loadData();
    loadSettings();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch('/api/content?type=teaching&admin=1');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load teaching:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/content?type=settings');
      const data = await res.json();
      if (data?.teachingPhilosophy) setPhil(data.teachingPhilosophy);
      if (data?.teachingCoursesTitle) setCoursesTitle(data.teachingCoursesTitle);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  // Section title save
  const handleSaveTitle = async () => {
    setSavingTitle(true);
    try {
      const res = await fetch('/api/content?type=settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teachingCoursesTitle: coursesTitle }),
      });
      if (res.ok) { setTitleSaved(true); setTimeout(() => setTitleSaved(false), 2000); }
    } catch (error) { console.error('Failed to save title:', error); }
    finally { setSavingTitle(false); }
  };

  const handleTitleChange = (field: string, value: string) => {
    const langSuffix = ['_ko', '_en', '_zh'].find(s => field.endsWith(s));
    if (!langSuffix) return;
    const lang = langSuffix.slice(1) as 'ko' | 'en' | 'zh';
    setCoursesTitle(prev => ({ ...prev, [lang]: value }));
  };

  // Sort order inline save
  const handleSortOrderChange = async (id: string, newOrder: number) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    try {
      await fetch(`/api/content?type=teaching&id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, sortOrder: newOrder }),
      });
      await loadData();
    } catch (error) { console.error('Failed to update sort order:', error); }
  };

  // Teaching philosophy helpers
  const handleParaChange = (para: 'paragraph1' | 'paragraph2', field: string, value: string) => {
    const langSuffix = ['_ko', '_en', '_zh'].find(s => field.endsWith(s));
    if (!langSuffix) return;
    const lang = langSuffix.slice(1) as 'ko' | 'en' | 'zh';
    setPhil(prev => ({ ...prev, [para]: { ...prev[para], [lang]: value } }));
  };

  const handlePrincipleChange = (index: number, part: 'title' | 'desc', field: string, value: string) => {
    const langSuffix = ['_ko', '_en', '_zh'].find(s => field.endsWith(s));
    if (!langSuffix) return;
    const lang = langSuffix.slice(1) as 'ko' | 'en' | 'zh';
    setPhil(prev => ({
      ...prev,
      principles: prev.principles.map((p, i) =>
        i === index ? { ...p, [part]: { ...p[part], [lang]: value } } : p
      ),
    }));
  };

  const handleAddPrinciple = () => {
    setPhil(prev => ({
      ...prev,
      principles: [...prev.principles, { title: { ko: '', en: '', zh: '' }, desc: { ko: '', en: '', zh: '' } }],
    }));
  };

  const handleRemovePrinciple = (index: number) => {
    setPhil(prev => ({ ...prev, principles: prev.principles.filter((_, i) => i !== index) }));
  };

  const handleSavePhil = async () => {
    setSavingPhil(true);
    try {
      const res = await fetch('/api/content?type=settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teachingPhilosophy: phil }),
      });
      if (res.ok) { setPhilSaved(true); setTimeout(() => setPhilSaved(false), 2000); }
    } catch (error) { console.error('Failed to save philosophy:', error); }
    finally { setSavingPhil(false); }
  };

  // Course form
  const emptyItem: Partial<Teaching> = {
    title: { ko: '', en: '', zh: '' },
    summary: { ko: '', en: '', zh: '' },
    description: { ko: '', en: '', zh: '' },
    keywords: { ko: '', en: '', zh: '' },
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
    {
      key: 'featured',
      label: '대표',
      render: (value: any) => value ? '★' : '',
    },
    {
      key: 'sortOrder',
      label: '순서',
      render: (value: any, row: any) => (
        <input
          type="number"
          defaultValue={value ?? ''}
          placeholder="—"
          className="w-16 border border-border px-2 py-0.5 text-xs text-center bg-background"
          onBlur={e => {
            const val = parseInt(e.target.value);
            if (!isNaN(val)) handleSortOrderChange(row.id, val);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
          }}
          onClick={e => e.stopPropagation()}
        />
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        code="TEACHING"
        title="교육 관리"
        description="강의 및 교육 콘텐츠를 관리합니다"
        action={
          !showForm ? (
            <button onClick={handleNew} className="btn-primary">+ 새 강의 추가</button>
          ) : undefined
        }
      />

      {showForm ? (
        <div className="space-y-6 max-w-4xl">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{editing ? '강의 수정' : '새 강의 추가'}</h2>
            <button onClick={() => setShowForm(false)} className="btn-secondary text-sm">취소</button>
          </div>

          <div className="card space-y-6">
            <BilingualInput label="강의명" nameKo="title_ko" nameEn="title_en" nameZh="title_zh"
              valueKo={(form.title as any)?.ko || ''} valueEn={(form.title as any)?.en || ''} valueZh={(form.title as any)?.zh || ''}
              onChange={handleChange} required />
            <BilingualInput label="요약" nameKo="summary_ko" nameEn="summary_en" nameZh="summary_zh"
              valueKo={(form.summary as any)?.ko || ''} valueEn={(form.summary as any)?.en || ''} valueZh={(form.summary as any)?.zh || ''}
              onChange={handleChange} multiline rows={3} />
            <BilingualInput label="상세 설명" nameKo="description_ko" nameEn="description_en" nameZh="description_zh"
              valueKo={(form.description as any)?.ko || ''} valueEn={(form.description as any)?.en || ''} valueZh={(form.description as any)?.zh || ''}
              onChange={handleChange} multiline rows={5} />
            <BilingualInput label="키워드" nameKo="keywords_ko" nameEn="keywords_en" nameZh="keywords_zh"
              valueKo={(form.keywords as any)?.ko || ''} valueEn={(form.keywords as any)?.en || ''} valueZh={(form.keywords as any)?.zh || ''}
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
                <input type="text" value={form.semester || ''} onChange={e => setForm(prev => ({ ...prev, semester: e.target.value }))} className="input-field" placeholder="예: 2026-1" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">구분</label>
                <input type="text" value={form.courseType || ''} onChange={e => setForm(prev => ({ ...prev, courseType: e.target.value }))} className="input-field" placeholder="예: 전공필수" />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured || false} onChange={e => setForm(prev => ({ ...prev, featured: e.target.checked }))} />
                <span className="text-sm">해당 학기 강의 (★)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.published || false} onChange={e => setForm(prev => ({ ...prev, published: e.target.checked }))} />
                <span className="text-sm">게시</span>
              </label>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? '저장 중...' : '저장하기'}
          </button>
        </div>
      ) : (
        <div className="space-y-10">

          {/* Section title editor */}
          <div className="max-w-4xl">
            <div className="mb-3">
              <p className="mono-xs text-muted-foreground mb-1">// COURSES SECTION TITLE</p>
              <h2 className="font-semibold">대표 강의 섹션 제목</h2>
              <p className="text-sm text-muted-foreground mt-1">
                웹사이트 교육 페이지의 '대표 강의' 섹션 제목을 변경합니다. 예: 26년 1학기 강의
              </p>
            </div>
            <div className="card space-y-4">
              <BilingualInput
                label=""
                nameKo="ctitle_ko" nameEn="ctitle_en" nameZh="ctitle_zh"
                valueKo={coursesTitle.ko}
                valueEn={coursesTitle.en}
                valueZh={(coursesTitle as any).zh || ''}
                onChange={handleTitleChange}
              />
            </div>
            <div className="flex items-center gap-4 mt-3">
              <button onClick={handleSaveTitle} disabled={savingTitle} className="btn-primary disabled:opacity-50">
                {savingTitle ? '저장 중...' : '제목 저장'}
              </button>
              {titleSaved && <span className="text-sm text-green-600">✓ 저장됐습니다</span>}
            </div>
          </div>

          {/* Course list with sort order */}
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              '순서' 칸에 숫자를 입력하고 Enter 또는 클릭 밖을 누르면 즉시 저장됩니다. 숫자가 작을수록 위에 표시됩니다.
            </p>
            <ContentTable
              columns={columns}
              data={items as any}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onTogglePublish={handleTogglePublish}
            />
          </div>

          {/* Teaching Philosophy editor */}
          <div className="max-w-4xl">
            <div className="mb-4">
              <p className="mono-xs text-muted-foreground mb-1">// PHILOSOPHY</p>
              <h2 className="font-semibold">교육 철학 관리</h2>
              <p className="text-sm text-muted-foreground mt-1">
                웹사이트 교육 페이지의 '교육 철학' 섹션에 표시됩니다.
              </p>
            </div>

            <div className="space-y-6">
              <div className="card space-y-4">
                <p className="text-sm font-medium text-muted-foreground">교육 철학 텍스트</p>
                <BilingualInput
                  label=""
                  nameKo="para1_ko" nameEn="para1_en" nameZh="para1_zh"
                  valueKo={phil.paragraph1.ko}
                  valueEn={phil.paragraph1.en}
                  valueZh={(phil.paragraph1 as any).zh || ''}
                  onChange={(field, value) => handleParaChange('paragraph1', field, value)}
                  multiline rows={4}
                />
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium">교육 가치 항목</p>

                {phil.principles.length === 0 && (
                  <p className="text-sm text-muted-foreground">아직 등록된 항목이 없습니다.</p>
                )}

                {phil.principles.map((principle, index) => (
                  <div key={index} className="border border-border p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="mono-xs text-muted-foreground">항목 {index + 1}</span>
                      <button
                        onClick={() => handleRemovePrinciple(index)}
                        className="text-xs text-muted-foreground hover:text-foreground border border-border px-2 py-1"
                      >
                        삭제
                      </button>
                    </div>
                    <BilingualInput
                      label="제목"
                      nameKo={`prin_${index}_title_ko`}
                      nameEn={`prin_${index}_title_en`}
                      nameZh={`prin_${index}_title_zh`}
                      valueKo={principle.title.ko}
                      valueEn={principle.title.en}
                      valueZh={(principle.title as any).zh || ''}
                      onChange={(field, value) => handlePrincipleChange(index, 'title', field, value)}
                    />
                    <BilingualInput
                      label="설명"
                      nameKo={`prin_${index}_desc_ko`}
                      nameEn={`prin_${index}_desc_en`}
                      nameZh={`prin_${index}_desc_zh`}
                      valueKo={principle.desc.ko}
                      valueEn={principle.desc.en}
                      valueZh={(principle.desc as any).zh || ''}
                      onChange={(field, value) => handlePrincipleChange(index, 'desc', field, value)}
                    />
                  </div>
                ))}

                <button onClick={handleAddPrinciple} className="btn-secondary text-sm w-full">
                  + 항목 추가
                </button>
              </div>

              <div className="flex items-center gap-4">
                <button onClick={handleSavePhil} disabled={savingPhil} className="btn-primary disabled:opacity-50">
                  {savingPhil ? '저장 중...' : '교육 철학 저장'}
                </button>
                {philSaved && <span className="text-sm text-green-600">✓ 저장됐습니다</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
