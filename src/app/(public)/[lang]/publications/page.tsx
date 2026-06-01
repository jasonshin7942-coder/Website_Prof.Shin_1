'use client';

import { useState, useEffect } from 'react';
import { getDictionary } from '@/i18n/dictionaries';
import { getLocalizedText } from '@/types/content';
import type { Publication } from '@/types/content';
import type { Locale } from '@/i18n/config';
import { useParams } from 'next/navigation';
import SectionHeader from '@/components/public/SectionHeader';
import AsciiDecoration from '@/components/public/AsciiDecoration';

const categories = ['all', 'journal', 'conference', 'book', 'chapter', 'thesis', 'other'] as const;

export default function PublicationsPage() {
  const params = useParams();
  const locale = (params.lang as string) as Locale;
  const dict = getDictionary(locale);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [publications, setPublications] = useState<Publication[]>([]);

  useEffect(() => {
    fetch('/api/content?type=publications')
      .then(r => r.json())
      .then(data => setPublications(data))
      .catch(() => {});
  }, []);

  const categoryLabels: Record<string, string> = {
    all: dict.publications.filterAll,
    journal: dict.publications.journal,
    conference: dict.publications.conference,
    book: dict.publications.book,
    chapter: dict.publications.chapter,
    thesis: dict.publications.thesis,
    other: dict.publications.other,
  };

  const filtered = publications.filter(pub => {
    const matchCategory = filter === 'all' || pub.category === filter;
    const q = search.toLowerCase();
    const matchSearch = !search ||
      pub.title.ko.toLowerCase().includes(q) ||
      pub.title.en.toLowerCase().includes(q) ||
      pub.authors.toLowerCase().includes(q) ||
      pub.keywords.ko.toLowerCase().includes(q) ||
      pub.keywords.en.toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });

  const featured = publications.filter(p => p.featured);

  return (
    <>
      {/* Hero */}
      <section className="ascii-bg scanline-overlay crt-lines relative py-24 border-b border-border">
        <AsciiDecoration />
        <div className="container-wide">
          <p className="mono-xs text-muted-foreground mb-4">// PUBLICATIONS</p>
          <h1 className="heading-xl mb-6">{dict.publications.title}</h1>
          <p className="body-lg text-muted-foreground max-w-2xl">
            {locale === 'ko'
              ? '학술지 논문, 학회 발표, 저서 등 연구 성과를 확인하실 수 있습니다.'
              : locale === 'zh'
              ? '可查阅学术期刊论文、学术会议发表、专著等研究成果。'
              : 'Browse research publications including journal papers, conference presentations, and books.'}
          </p>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="py-16 border-b border-border bg-muted/30">
          <div className="container-wide">
            <SectionHeader
              label="// FEATURED"
              title={dict.publications.featured}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((pub) => (
                <div key={pub.id} className="card card-featured">
                  <span className="mono-xs text-muted-foreground block mb-3">
                    {pub.year} · {categoryLabels[pub.category]}
                  </span>
                  <h3 className="font-semibold text-base mb-2">
                    {getLocalizedText(pub.title, locale)}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">{pub.authors}</p>
                  <p className="text-sm text-muted-foreground italic">
                    {getLocalizedText(pub.venue, locale)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search + Filter */}
      <section className="py-4 border-b border-border sticky top-16 md:top-[84px] bg-background/95 backdrop-blur-sm z-10">
        <div className="container-wide">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder={dict.publications.search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field w-full sm:max-w-md"
            />
            <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`mono-xs px-3 py-2 border shrink-0 transition-colors ${
                    filter === cat
                      ? 'bg-foreground text-background border-foreground'
                      : 'border-border hover:border-foreground text-muted-foreground'
                  }`}
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* List */}
      <section className="py-12">
        <div className="container-wide">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-mono text-4xl text-muted-foreground/20 mb-4">∅</p>
              <p className="text-muted-foreground">{dict.publications.noResults}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((pub) => (
                <article key={pub.id} className="card group">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-20 shrink-0">
                      <span className="mono-xs text-muted-foreground">{pub.year}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base mb-1 group-hover:underline underline-offset-4">
                        {getLocalizedText(pub.title, locale)}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1">{pub.authors}</p>
                      <p className="text-sm text-muted-foreground italic mb-2">
                        {getLocalizedText(pub.venue, locale)}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {getLocalizedText(pub.abstract, locale)}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {getLocalizedText(pub.keywords, locale).split(', ').map((kw) => (
                          <span key={kw} className="mono-xs border border-border px-2 py-0.5 text-muted-foreground">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="md:w-24 shrink-0 flex md:flex-col gap-2 items-start">
                      <span className="mono-xs border border-border px-2 py-0.5 text-muted-foreground">
                        {categoryLabels[pub.category]}
                      </span>
                      {pub.pdfUrl && (
                        <a href={pub.pdfUrl} className="mono-xs text-accent hover:underline" target="_blank" rel="noopener noreferrer">
                          PDF
                        </a>
                      )}
                      {pub.externalUrl && (
                        <a href={pub.externalUrl} className="mono-xs text-accent hover:underline" target="_blank" rel="noopener noreferrer">
                          LINK
                        </a>
                      )}
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
