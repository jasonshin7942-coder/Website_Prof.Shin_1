'use client';

import { useState, useEffect } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import BilingualInput from '@/components/admin/BilingualInput';
import ContentTable from '@/components/admin/ContentTable';
import { showToast } from '@/components/admin/Toast';
import type { Teaching, TeachingPhilosophy } from '@/types/content';

const categoryOptions = [
  { value: 'undergraduate', label: '학부' },
  { value: 'graduate', label: '대학원' },
  { value: 'workshop', label: '워크숍' },
  { value: 'seminar', label: '세미나' },
  { value: 'other', label: '기타' },
];

const defaultPhilosophy: TeachingPhilosophy = {
  paragraph1: {
    ko: '교육은 단순한 지식 전달이 아닌, 학생들이 스스로 사고하고 창조할 수 있는 역량을 키우는 과정입니다. 기술과 인문학의 경계를 넘나들며, 학생들이 AI 시대에 필요한 융합적 사고력과 창의성을 갖출 수 있도록 안내합니다.',
    en: 'Education is not merely knowledge transfer, but a process of cultivating students\' ability to think and create independently. Crossing the boundaries between technology and humanities, we guide students to develop the convergent thinking and creativity needed in the AI era.',
  },
  paragraph2: {
    ko: '프로젝트 기반 학습을 통해 이론과 실습을 유기적으로 연결하며, 동료 학습과 멘토링을 통해 협업 능력을 강화합니다.',
    en: 'Through project-based learning, we organically connect theory and practice, while strengthening collaboration skills through peer learning and mentoring.',
  },
  principles: [
    { title: { ko: '창의적 사고', en: 'Creative Thinking' }, desc: { ko: '고정관념을 넘어선 새로운 시각', en: 'New perspectives beyond stereotypes' } },
    { title: { ko: '기술적 역량', en: 'Technical Competency' }, desc: { ko: '도구를 다루는 실질적 능력', en: 'Practical ability to handle tools' } },
    { title: { ko: '비판적 분석', en: 'Critical Analysis' }, desc: { ko: '깊이 있는 사고와 평가 능력', en: 'In-depth thinking and evaluation' } },
    { title: { ko: '협업과 소통', en: 'Collaboration' }, desc: { ko: '다양한 배경의 팀원과 함께', en: 'Working with diverse team members' } },
  ],
};

export default function AdminTeachingPage() {
  const [items, setItems] = useState<Teaching[]>([]);
  const [editing, setEditing] = useState<Teaching | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [philosophy, setPhilosophy] = useState<TeachingPhilosophy>(defaultPhilosophy);
  const [showPhilosophy, setShowPhilosophy] = useState(false);
  const [savingPhilosophy, setSavingPhilosophy] = useState(false);

  useEffect(() => {
    loadData();
    loadPhilosophy();
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

  const loadPhilosophy = async () => {
    try {
      const res = await fetch('/api/content?type=settings');
      const data = await res.json();
      if (data?.teachingPhilosophy) {
        setPhilosophy(data.teachingPhilosophy);
      }
    } catch (error) {
      console.error('Failed to load philosophy:', error);
    }
  };

  const handleSavePhilosophy = async () => {
    setSavingPhilosophy(true);
    try {
      const settingsRes = await fetch('/api/content?type=settings');
      const settings = await settingsRes.json();
      const res = await fetch('/api/content?type=settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, teachingPhilosophy: philosophy }),
      });
      if (res.ok) {
        showToast('success', '교육철학이 저장되었습니다');
      } else {
        showToast('error', '저장에 실패했습니다');
      }
    } catch (error) {
      console.error('Failed to save philosophy:', error);
      showToast('error', '저장 중 오류가 발생했습니다');
    } finally {
      setSavingPhilosophy(false);
    }
  };

  const handlePhilosophyChange = (field: string, value: string) => {
    setPhilosophy(prev => {
      if (field.startsWith('paragraph1_')) {
        const lang = field.endsWith('_ko') ? 'ko' : 'en';
        return { ...prev, paragraph1: { ...prev.paragraph1, [lang]: value } };
      }
      if (field.startsWith('paragraph2_')) {
        const lang = field.endsWith('_ko') ? 'ko' : 'en';
        return { ...prev, paragraph2: { ...prev.paragraph2, [lang]: value } };
      }
      return prev;
    });
  };

  const handlePrincipleChange = (index: number, field: 'title' | 'desc', lang: 'ko' | 'en', value: string) => {
    setPhilosophy(prev => {
      const principles = [...prev.principles];
      principles[index] = {
        ...principles[index],
        [field]: { ...principles[index][field], [lang]: value },
      };
      return { ...prev, principles };
    });
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

      {/* Teaching Philosophy Editor */}
      <div className="mb-8 max-w-4xl">
        <button
          onClick={() => setShowPhilosophy(!showPhilosophy)}
          className="btn-secondary text-sm mb-4"
        >
          {showPhilosophy ? '▲ 교육철학 편집 닫기' : '▼ 교육철학 편집'}
        </button>

        {showPhilosophy && (
          <div className="space-y-6">
            <div className="card space-y-6">
              <h3 className="font-semibold text-sm">교육철학 내용</h3>
              <div>
                <label className="block text-sm font-medium mb-1.5">첫 번째 문단 (한국어)</label>
                <textarea
                  value={philosophy.paragraph1.ko}
                  onChange={e => handlePhilosophyChange('paragraph1_ko', e.target.value)}
                  className="input-field" rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">첫 번째 문단 (English)</label>
                <textarea
                  value={philosophy.paragraph1.en}
                  onChange={e => handlePhilosophyChange('paragraph1_en', e.target.value)}
                  className="input-field" rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">두 번째 문단 (한국어)</label>
                <textarea
                  value={philosophy.paragraph2.ko}
                  onChange={e => handlePhilosophyChange('paragraph2_ko', e.target.value)}
                  className="input-field" rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">두 번째 문단 (English)</label>
                <textarea
                  value={philosophy.paragraph2.en}
                  onChange={e => handlePhilosophyChange('paragraph2_en', e.target.value)}
                  className="input-field" rows={3}
                />
              </div>
            </div>

            <div className="card space-y-6">
              <h3 className="font-semibold text-sm">교육 원칙 (우측 카드)</h3>
              {philosophy.principles.map((p, i) => (
                <div key={i} className="border border-border p-4 space-y-3">
                  <p className="mono-xs text-muted-foreground">원칙 {i + 1}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">제목 (한국어)</label>
                      <input type="text" value={p.title.ko} onChange={e => handlePrincipleChange(i, 'title', 'ko', e.target.value)} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Title (English)</label>
                      <input type="text" value={p.title.en} onChange={e => handlePrincipleChange(i, 'title', 'en', e.target.value)} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">설명 (한국어)</label>
                      <input type="text" value={p.desc.ko} onChange={e => handlePrincipleChange(i, 'desc', 'ko', e.target.value)} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Description (English)</label>
                      <input type="text" value={p.desc.en} onChange={e => handlePrincipleChange(i, 'desc', 'en', e.target.value)} className="input-field" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleSavePhilosophy} disabled={savingPhilosophy} className="btn-primary disabled:opacity-50">
              {savingPhilosophy ? '저장 중...' : '교육철학 저장'}
            </button>
          </div>
        )}
      </div>

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
