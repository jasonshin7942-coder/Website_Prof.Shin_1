'use client';

import { useState, useEffect } from 'react';
import { getDictionary } from '@/i18n/dictionaries';
import { getLocalizedText } from '@/types/content';
import type { Activity } from '@/types/content';
import type { Locale } from '@/i18n/config';
import { useParams } from 'next/navigation';
import SectionHeader from '@/components/public/SectionHeader';
import AsciiDecoration from '@/components/public/AsciiDecoration';

const activityTypes = ['all', 'conference', 'talk', 'workshop', 'exhibition', 'collaboration', 'exchange'] as const;

export default function ActivitiesPage() {
  const params = useParams();
  const locale = (params.lang as string) as Locale;
  const dict = getDictionary(locale);
  const [filter, setFilter] = useState<string>('all');
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch('/api/content?type=activities')
      .then(r => r.json())
      .then(data => setActivities(data))
      .catch(() => {});
  }, []);

  const typeLabels: Record<string, string> = locale === 'ko'
    ? { all: '전체', conference: '학술대회', talk: '강연', workshop: '워크숍', exhibition: '전시', collaboration: '협업', exchange: '교류' }
    : locale === 'zh'
    ? { all: '全部', conference: '学术会议', talk: '演讲', workshop: '研讨会', exhibition: '展览', collaboration: '合作', exchange: '交流' }
    : { all: 'All', conference: 'Conference', talk: 'Talk', workshop: 'Workshop', exhibition: 'Exhibition', collaboration: 'Collaboration', exchange: 'Exchange' };

  const filtered = filter === 'all' ? activities : activities.filter(a => a.type === filter);

  return (
    <>
      {/* Hero */}
      <section className="ascii-bg scanline-overlay crt-lines relative py-24 border-b border-border">
        <AsciiDecoration />
        <div className="container-wide">
          <p className="mono-xs text-muted-foreground mb-4">// ACTIVITIES</p>
          <h1 className="heading-xl mb-6">{dict.activities.title}</h1>
          <p className="body-lg text-muted-foreground max-w-2xl">
            {locale === 'ko'
              ? '국내외 학술대회, 전시, 강연, 워크숍 등 다양한 학술·문화 활동을 수행하고 있습니다.'
              : locale === 'zh'
              ? '参与国内外学术会议、展览、演讲、研讨会等多样化的学术与文化活动。'
              : 'Engaging in diverse academic and cultural activities including conferences, exhibitions, lectures, and workshops.'}
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-4 border-b border-border sticky top-16 md:top-[84px] bg-background/95 backdrop-blur-sm z-10">
        <div className="container-wide">
          <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide">
            {activityTypes.map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`mono-xs px-3 py-2 border shrink-0 transition-colors ${
                  filter === type
                    ? 'bg-foreground text-background border-foreground'
                    : 'border-border hover:border-foreground text-muted-foreground'
                }`}
              >
                {typeLabels[type] || type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="container-wide">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">{dict.publications.noResults}</p>
            </div>
          ) : (
            <div className="space-y-0">
              {filtered.map((act, i) => (
                <article key={act.id} className="relative pl-8 pb-12 border-l border-border last:pb-0">
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-0 -translate-x-1/2 w-2 h-2 bg-foreground" />

                  <div className="card ml-4">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="mono-xs text-muted-foreground">{act.date}</span>
                      <span className="mono-xs border border-border px-2 py-0.5 text-muted-foreground">
                        {typeLabels[act.type] || act.type}
                      </span>
                      {act.featured && (
                        <span className="mono-xs bg-foreground text-background px-2 py-0.5">
                          FEATURED
                        </span>
                      )}
                    </div>

                    <div className={act.imageUrl ? 'flex flex-col md:flex-row gap-5' : ''}>
                      {act.imageUrl && (
                        <div className="md:w-56 shrink-0">
                          <img
                            src={act.imageUrl}
                            alt={getLocalizedText(act.title, locale)}
                            className="w-full h-auto object-cover border border-border"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-2">
                          {getLocalizedText(act.title, locale)}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          📍 {getLocalizedText(act.location, locale)}
                        </p>
                        <p className="text-sm text-muted-foreground mb-3">
                          {getLocalizedText(act.summary, locale)}
                        </p>
                        <p className="body-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                          {getLocalizedText(act.description, locale)}
                        </p>
                        {act.relatedLink && (
                          <a
                            href={act.relatedLink}
                            className="inline-block mt-3 text-sm font-medium hover:underline underline-offset-4"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {dict.common.readMore} →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
