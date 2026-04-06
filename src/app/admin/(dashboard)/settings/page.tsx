'use client';

import { useState, useEffect } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import BilingualInput from '@/components/admin/BilingualInput';
import { showToast } from '@/components/admin/Toast';
import type { SiteSettings } from '@/types/content';

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/content?type=settings');
      const data = await res.json();
      setForm(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
      showToast('error', '설정을 불러오는데 실패했습니다');
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
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/content?type=settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        showToast('success', '설정이 저장되었습니다');
      } else {
        showToast('error', `설정 저장 실패: ${res.status} ${res.statusText}`);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      showToast('error', '설정 저장 중 오류가 발생했습니다');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        code="SETTINGS"
        title="설정"
        description="사이트 기본 설정을 관리합니다"
        action={
          <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? '저장 중...' : '저장하기'}
          </button>
        }
      />

      <div className="space-y-8 max-w-4xl">
        {/* Site Info */}
        <div className="card">
          <h3 className="font-semibold text-sm mb-4">사이트 기본 정보</h3>
          <div className="space-y-6">
            <BilingualInput
              label="사이트 이름" nameKo="siteName_ko" nameEn="siteName_en"
              valueKo={(form.siteName as any)?.ko || ''} valueEn={(form.siteName as any)?.en || ''}
              onChange={handleChange}
            />
            <BilingualInput
              label="사이트 설명" nameKo="siteDescription_ko" nameEn="siteDescription_en"
              valueKo={(form.siteDescription as any)?.ko || ''} valueEn={(form.siteDescription as any)?.en || ''}
              onChange={handleChange} multiline rows={2}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">기본 언어</label>
                <select
                  value={form.defaultLanguage || 'ko'}
                  onChange={e => setForm(prev => prev ? { ...prev, defaultLanguage: e.target.value as 'ko' | 'en' } : prev)}
                  className="input-field"
                >
                  <option value="ko">한국어</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">연락 이메일</label>
                <input
                  type="email"
                  value={form.contactEmail || ''}
                  onChange={e => setForm(prev => prev ? { ...prev, contactEmail: e.target.value } : prev)}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="card">
          <h3 className="font-semibold text-sm mb-4">SEO 설정</h3>
          <div className="space-y-6">
            <BilingualInput
              label="SEO 제목" nameKo="seoTitle_ko" nameEn="seoTitle_en"
              valueKo={(form.seoTitle as any)?.ko || ''} valueEn={(form.seoTitle as any)?.en || ''}
              onChange={handleChange}
            />
            <BilingualInput
              label="SEO 설명" nameKo="seoDescription_ko" nameEn="seoDescription_en"
              valueKo={(form.seoDescription as any)?.ko || ''} valueEn={(form.seoDescription as any)?.en || ''}
              onChange={handleChange} multiline rows={2}
            />
            <div>
              <label className="block text-sm font-medium mb-1.5">Analytics ID</label>
              <input
                type="text"
                value={form.analyticsId || ''}
                onChange={e => setForm(prev => prev ? { ...prev, analyticsId: e.target.value } : prev)}
                className="input-field max-w-md"
                placeholder="G-XXXXXXXXXX"
              />
              <p className="text-xs text-muted-foreground mt-1">Google Analytics 추적 ID</p>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="card bg-muted/30">
          <h3 className="font-semibold text-sm mb-4">시스템 정보</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">프레임워크</p>
              <p className="font-medium">Next.js 16</p>
            </div>
            <div>
              <p className="text-muted-foreground">언어</p>
              <p className="font-medium">TypeScript</p>
            </div>
            <div>
              <p className="text-muted-foreground">스타일</p>
              <p className="font-medium">Tailwind CSS 4</p>
            </div>
            <div>
              <p className="text-muted-foreground">데이터</p>
              <p className="font-medium">JSON File Storage</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
