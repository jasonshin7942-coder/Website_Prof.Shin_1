'use client';

import { useState, useEffect } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import BilingualInput from '@/components/admin/BilingualInput';
import { showToast } from '@/components/admin/Toast';
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
      if (field.includes('_ko') || field.includes('_en')) {
        const baseName = field.replace('_ko', '').replace('_en', '');
        const lang = field.endsWith('_ko') ? 'ko' : 'en';
        const current = (prev as any)[baseName] as { ko: string; en: string } || { ko: '', en: '' };
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
        showToast('success', '프로필이 저장되었습니다');
        setTimeout(() => setSaved(false), 3000);
      } else {
        showToast('error', '저장에 실패했습니다');
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      showToast('error', '저장 중 오류가 발생했습니다');
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
              nameKo="name_ko" nameEn="name_en"
              valueKo={(form.name as any)?.ko || ''}
              valueEn={(form.name as any)?.en || ''}
              onChange={handleChange}
              required
            />
            <BilingualInput
              label="직함"
              nameKo="title_ko" nameEn="title_en"
              valueKo={(form.title as any)?.ko || ''}
              valueEn={(form.title as any)?.en || ''}
              onChange={handleChange}
            />
            <BilingualInput
              label="소속"
              nameKo="affiliation_ko" nameEn="affiliation_en"
              valueKo={(form.affiliation as any)?.ko || ''}
              valueEn={(form.affiliation as any)?.en || ''}
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
              nameKo="shortIntro_ko" nameEn="shortIntro_en"
              valueKo={(form.shortIntro as any)?.ko || ''}
              valueEn={(form.shortIntro as any)?.en || ''}
              onChange={handleChange}
              multiline
              rows={3}
            />
            <BilingualInput
              label="상세 약력"
              nameKo="biography_ko" nameEn="biography_en"
              valueKo={(form.biography as any)?.ko || ''}
              valueEn={(form.biography as any)?.en || ''}
              onChange={handleChange}
              multiline
              rows={6}
            />
            <BilingualInput
              label="키워드"
              nameKo="keywords_ko" nameEn="keywords_en"
              valueKo={(form.keywords as any)?.ko || ''}
              valueEn={(form.keywords as any)?.en || ''}
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
          {form.profileImage && !form.profileImage.includes('placeholder') && (
            <div className="mb-4 flex items-center gap-4">
              <img src={form.profileImage} alt="프로필" className="w-32 h-auto max-h-40 object-contain border border-border" />
              <button
                onClick={() => { setForm(prev => prev ? { ...prev, profileImage: '' } : prev); setSaved(false); }}
                className="text-sm text-danger hover:underline"
              >
                이미지 삭제
              </button>
            </div>
          )}
          <div className="border-2 border-dashed border-border p-8 text-center">
            <p className="text-muted-foreground text-sm mb-2">이미지를 드래그하거나 클릭하여 업로드</p>
            <p className="mono-xs text-muted-foreground">JPG, PNG, WebP, GIF · 최대 5MB</p>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              id="profileImage"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const formData = new FormData();
                formData.append('file', file);
                try {
                  const res = await fetch('/api/upload', { method: 'POST', body: formData });
                  if (res.ok) {
                    const data = await res.json();
                    setForm(prev => prev ? { ...prev, profileImage: data.url } : prev);
                    setSaved(false);
                    showToast('success', '이미지가 업로드되었습니다. 저장 버튼을 눌러주세요.');
                  } else {
                    showToast('error', '이미지 업로드에 실패했습니다');
                  }
                } catch {
                  showToast('error', '이미지 업로드 중 오류가 발생했습니다');
                }
                e.target.value = '';
              }}
            />
            <label htmlFor="profileImage" className="btn-secondary inline-block mt-4 cursor-pointer">
              파일 선택
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
