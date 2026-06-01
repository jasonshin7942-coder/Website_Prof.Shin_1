'use client';

import { useState, useEffect } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import BilingualInput from '@/components/admin/BilingualInput';
import type { Profile } from '@/types/content';

export default function AdminProfilePage() {
  const [form, setForm] = useState<Partial<Profile> | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/content?type=profile');
      const data = await res.json();
      setForm(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  if (!form) {
    return <div className="p-8">Loading...</div>;
  }

  const handleChange = (field: string, value: string) => {
    setForm(prev => {
      if (!prev) return prev;
      const langSuffix = ['_ko', '_en', '_zh'].find(s => field.endsWith(s));
      if (langSuffix) {
        const baseName = field.slice(0, -langSuffix.length);
        const lang = langSuffix.slice(1);
        const current = (prev as any)[baseName] || { ko: '', en: '' };
        return { ...prev, [baseName]: { ...current, [lang]: value } };
      }
      return { ...prev, [field]: value };
    });
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/content?type=profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        code="PROFILE"
        title="프로필 관리"
        description="교수 프로필 정보를 수정합니다"
        action={
          <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? '저장 중...' : saved ? '✓ 저장됨' : '저장하기'}
          </button>
        }
      />

      <div className="space-y-8 max-w-4xl">
        {/* Basic Info */}
        <div className="card">
          <h3 className="font-semibold text-sm mb-4">기본 정보</h3>
          <div className="space-y-6">
            <BilingualInput
              label="이름"
              nameKo="name_ko" nameEn="name_en" nameZh="name_zh"
              valueKo={(form.name as any)?.ko || ''}
              valueEn={(form.name as any)?.en || ''}
              valueZh={(form.name as any)?.zh || ''}
              onChange={handleChange}
              required
            />
            <BilingualInput
              label="직함"
              nameKo="title_ko" nameEn="title_en" nameZh="title_zh"
              valueKo={(form.title as any)?.ko || ''}
              valueEn={(form.title as any)?.en || ''}
              valueZh={(form.title as any)?.zh || ''}
              onChange={handleChange}
            />
            <BilingualInput
              label="소속"
              nameKo="affiliation_ko" nameEn="affiliation_en" nameZh="affiliation_zh"
              valueKo={(form.affiliation as any)?.ko || ''}
              valueEn={(form.affiliation as any)?.en || ''}
              valueZh={(form.affiliation as any)?.zh || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Introduction */}
        <div className="card">
          <h3 className="font-semibold text-sm mb-4">소개</h3>
          <div className="space-y-6">
            <BilingualInput
              label="짧은 소개"
              nameKo="shortIntro_ko" nameEn="shortIntro_en" nameZh="shortIntro_zh"
              valueKo={(form.shortIntro as any)?.ko || ''}
              valueEn={(form.shortIntro as any)?.en || ''}
              valueZh={(form.shortIntro as any)?.zh || ''}
              onChange={handleChange}
              multiline
              rows={3}
            />
            <BilingualInput
              label="상세 약력"
              nameKo="biography_ko" nameEn="biography_en" nameZh="biography_zh"
              valueKo={(form.biography as any)?.ko || ''}
              valueEn={(form.biography as any)?.en || ''}
              valueZh={(form.biography as any)?.zh || ''}
              onChange={handleChange}
              multiline
              rows={6}
            />
            <BilingualInput
              label="키워드"
              nameKo="keywords_ko" nameEn="keywords_en" nameZh="keywords_zh"
              valueKo={(form.keywords as any)?.ko || ''}
              valueEn={(form.keywords as any)?.en || ''}
              valueZh={(form.keywords as any)?.zh || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Contact */}
        <div className="card">
          <h3 className="font-semibold text-sm mb-4">연락처</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">이메일</label>
              <input type="email" value={form.email || ''} onChange={e => setForm(prev => prev ? { ...prev, email: e.target.value } : prev)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">전화</label>
              <input type="text" value={form.phone || ''} onChange={e => setForm(prev => prev ? { ...prev, phone: e.target.value } : prev)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">연구실</label>
              <input type="text" value={form.office || ''} onChange={e => setForm(prev => prev ? { ...prev, office: e.target.value } : prev)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">웹사이트</label>
              <input type="url" value={form.website || ''} onChange={e => setForm(prev => prev ? { ...prev, website: e.target.value } : prev)} className="input-field" />
            </div>
          </div>
        </div>

        {/* Profile Image */}
        <div className="card">
          <h3 className="font-semibold text-sm mb-4">프로필 이미지</h3>
          <div className="border-2 border-dashed border-border p-8 text-center">
            <p className="text-muted-foreground text-sm mb-2">이미지를 드래그하거나 클릭하여 업로드</p>
            <p className="mono-xs text-muted-foreground">JPG, PNG · 최대 5MB</p>
            <input type="file" accept="image/*" className="hidden" id="profileImage" />
            <label htmlFor="profileImage" className="btn-secondary inline-block mt-4 cursor-pointer">
              파일 선택
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
