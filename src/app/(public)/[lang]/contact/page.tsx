'use client';

import { useState, useEffect } from 'react';
import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import type { Profile } from '@/types/content';
import { useParams } from 'next/navigation';

export default function ContactPage() {
  const params = useParams();
  const locale = (params.lang as string) as Locale;
  const dict = getDictionary(locale);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/content?type=profile')
      .then(r => r.json())
      .then(data => setProfile(data))
      .catch(() => {});
  }, []);

  const inquiryTypes = [
    { value: 'collaboration', label: dict.contact.collaboration },
    { value: 'invitation', label: dict.contact.invitation },
    { value: 'student', label: dict.contact.student },
    { value: 'media', label: dict.contact.media },
    { value: 'general', label: dict.contact.general },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const displayEmail = profile?.email || 'jcshin@chosun.ac.kr';
  const displayPhone = profile?.phone || '';
  const displayOffice = profile?.office || '';
  const displayName = profile?.name
    ? (locale === 'ko' ? profile.name.ko : profile.name.en)
    : (locale === 'ko' ? '신종천' : 'Jongcheon Shin');
  const displayTitle = profile?.title
    ? (locale === 'ko' ? profile.title.ko : profile.title.en)
    : (locale === 'ko' ? '교수' : 'Professor');
  const displayAffiliation = profile?.affiliation
    ? (locale === 'ko' ? profile.affiliation.ko : profile.affiliation.en)
    : '';

  return (
    <>
      {/* Hero */}
      <section className="ascii-bg py-24 border-b border-border">
        <div className="container-wide">
          <p className="mono-xs text-muted-foreground mb-4">// CONTACT</p>
          <h1 className="heading-xl mb-6">{dict.contact.title}</h1>
          <p className="body-lg text-muted-foreground max-w-2xl">
            {locale === 'ko'
              ? '연구 협업, 초청 강연, 학생 상담 등 다양한 문의를 환영합니다.'
              : 'Inquiries for research collaboration, speaking invitations, student consultations, and more are welcome.'}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              {/* Profile Image */}
              {profile?.profileImage && !profile.profileImage.includes('placeholder') && (
                <div className="w-full aspect-square max-w-[200px] border border-border overflow-hidden bg-muted">
                  <img src={profile.profileImage} alt={displayName} className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <p className="mono-xs text-muted-foreground mb-3">// INFORMATION</p>
                <div className="space-y-4">
                  {displayEmail && (
                    <div className="card">
                      <p className="mono-xs text-muted-foreground mb-1">{dict.contact.email}</p>
                      <p className="font-medium text-sm">{displayEmail}</p>
                    </div>
                  )}
                  {displayPhone && (
                    <div className="card">
                      <p className="mono-xs text-muted-foreground mb-1">{dict.contact.phone}</p>
                      <p className="font-medium text-sm">{displayPhone}</p>
                    </div>
                  )}
                  {displayOffice && (
                    <div className="card">
                      <p className="mono-xs text-muted-foreground mb-1">{dict.contact.office}</p>
                      <p className="font-medium text-sm">{displayOffice}</p>
                    </div>
                  )}
                  {profile?.website && (
                    <div className="card">
                      <p className="mono-xs text-muted-foreground mb-1">
                        {locale === 'ko' ? '웹사이트' : 'Website'}
                      </p>
                      <a href={profile.website} target="_blank" rel="noopener noreferrer"
                        className="font-medium text-sm hover:underline underline-offset-4">
                        {profile.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="mono-xs text-muted-foreground mb-3">// {dict.contact.inquiryTypes.toUpperCase()}</p>
                <div className="space-y-2">
                  {inquiryTypes.map((type) => (
                    <div key={type.value} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="text-foreground">→</span>
                      <span>{type.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ASCII art card */}
              <div className="font-mono text-[9px] text-muted-foreground/20 leading-tight select-none">
                <pre>
{`┌─────────────────────┐
│  ${(displayName.toUpperCase() + '                     ').substring(0, 20)}│
│  ${(displayTitle.toUpperCase() + '                     ').substring(0, 20)}│
│  ─────────────────  │
│  AI · ART · CULTURE │
│  ${(displayAffiliation.substring(0, 20) + '                     ').substring(0, 20)}│
│  ${(displayEmail + '                     ').substring(0, 20)}│
└─────────────────────┘`}
                </pre>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <p className="mono-xs text-muted-foreground mb-6">// {dict.contact.sendMessage.toUpperCase()}</p>

              {submitted ? (
                <div className="card text-center py-16">
                  <p className="font-mono text-4xl text-muted-foreground/20 mb-4">✓</p>
                  <p className="heading-sm mb-2">
                    {locale === 'ko' ? '메시지가 전송되었습니다' : 'Message Sent'}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {locale === 'ko'
                      ? '빠른 시일 내에 답변드리겠습니다. 감사합니다.'
                      : 'Thank you. We will respond as soon as possible.'}
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', inquiryType: '', subject: '', message: '' }); }}
                    className="btn-secondary mt-6"
                  >
                    {locale === 'ko' ? '새 메시지 작성' : 'Write New Message'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">{dict.contact.name}</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{dict.contact.email}</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{dict.contact.inquiryType}</label>
                    <select
                      required
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="input-field"
                    >
                      <option value="">{locale === 'ko' ? '선택해주세요' : 'Select...'}</option>
                      {inquiryTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{dict.contact.subject}</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{dict.contact.message}</label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="input-field resize-none"
                    />
                  </div>

                  <button type="submit" className="btn-primary">
                    {dict.contact.sendMessage} →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
