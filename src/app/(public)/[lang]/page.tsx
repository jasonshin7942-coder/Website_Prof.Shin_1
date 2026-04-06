import Link from 'next/link';
import { getDictionary } from '@/i18n/dictionaries';
import { getProfile, getResearchList, getPublicationList, getActivityList } from '@/content';
import { getLocalizedText } from '@/types/content';
import type { Locale } from '@/i18n/config';
import SectionHeader from '@/components/public/SectionHeader';

export const dynamic = 'force-dynamic';

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const profile = await getProfile();
  const featuredResearch = await getResearchList({ published: true, featured: true });
  const featuredPubs = await getPublicationList({ published: true, featured: true });
  const recentActivities = await getActivityList({ published: true });

  return (
    <>
      {/* Hero */}
      <section className="ascii-bg scanline-overlay relative min-h-[85vh] flex items-center border-b border-border">
        <div className="container-wide py-24 md:py-32">
          <div className="max-w-4xl">
            <p className="mono-xs text-muted-foreground mb-6 animate-fade-in">
              {getLocalizedText(profile.affiliation, locale)}
            </p>
            <h1 className="heading-xl mb-8 animate-fade-in-up">
              {dict.home.heroTitle}
            </h1>
            <p className="body-lg text-muted-foreground max-w-2xl mb-10 animate-fade-in-up animate-delay-100">
              {getLocalizedText(profile.shortIntro, locale)}
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up animate-delay-200">
              <Link href={`/${lang}/research`} className="btn-primary inline-block">
                {dict.home.learnMore}
              </Link>
              <Link href={`/${lang}/chat`} className="btn-secondary inline-block">
                {dict.home.startChat} →
              </Link>
            </div>
          </div>

          {/* Decorative ASCII column */}
          <div className="hidden xl:block absolute right-12 top-1/2 -translate-y-1/2 opacity-[0.07] select-none pointer-events-none">
            <pre className="font-mono text-[10px] leading-tight">
{`01001010 01000011
01010011 00101110
01000001 01001001
00100110 01000001
01110010 01110100
00101110 00001010
01000011 01110101
01101100 01110100
01110101 01110010
01100101 00101110
01000101 01100100
01110101 01100011
01100001 01110100
01101001 01101111
01101110 00101110`}
            </pre>
          </div>
        </div>
      </section>

      {/* Research Overview */}
      <section className="py-24 border-b border-border">
        <div className="container-wide">
          <SectionHeader
            label="// RESEARCH"
            title={dict.home.researchSection}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredResearch.slice(0, 3).map((item, i) => (
              <div key={item.id} className={`card card-featured animate-fade-in-up animate-delay-${(i + 1) * 100}`}>
                <p className="mono-xs text-muted-foreground mb-3">{item.year}</p>
                <h3 className="heading-sm mb-3">{getLocalizedText(item.title, locale)}</h3>
                <p className="body-sm text-muted-foreground mb-4">
                  {getLocalizedText(item.summary, locale)}
                </p>
                <p className="mono-xs text-muted-foreground">
                  {getLocalizedText(item.keywords, locale)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href={`/${lang}/research`} className="text-sm font-medium hover:underline underline-offset-4">
              {dict.home.viewAll} →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Publications */}
      <section className="py-24 border-b border-border bg-muted/30">
        <div className="container-wide">
          <SectionHeader
            label="// PUBLICATIONS"
            title={dict.home.featuredPublications}
          />
          <div className="space-y-4">
            {featuredPubs.slice(0, 3).map((pub) => (
              <div key={pub.id} className="card flex flex-col md:flex-row md:items-start gap-4">
                <div className="shrink-0">
                  <span className="mono-xs text-muted-foreground">{pub.year}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base mb-1">
                    {getLocalizedText(pub.title, locale)}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">{pub.authors}</p>
                  <p className="text-sm text-muted-foreground">
                    {getLocalizedText(pub.venue, locale)}
                  </p>
                </div>
                <span className="mono-xs text-muted-foreground shrink-0 self-start">
                  {pub.category}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href={`/${lang}/publications`} className="text-sm font-medium hover:underline underline-offset-4">
              {dict.home.viewAll} →
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Activities */}
      <section className="py-24 border-b border-border">
        <div className="container-wide">
          <SectionHeader
            label="// ACTIVITIES"
            title={dict.home.activitiesSection}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentActivities.slice(0, 4).map((act) => (
              <div key={act.id} className="card group">
                <div className="flex items-start justify-between mb-3">
                  <span className="mono-xs text-muted-foreground">{act.date}</span>
                  <span className="mono-xs text-muted-foreground border border-border px-2 py-0.5">
                    {act.type}
                  </span>
                </div>
                <h3 className="font-semibold text-base mb-2">
                  {getLocalizedText(act.title, locale)}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {getLocalizedText(act.location, locale)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {getLocalizedText(act.summary, locale)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href={`/${lang}/activities`} className="text-sm font-medium hover:underline underline-offset-4">
              {dict.home.viewAll} →
            </Link>
          </div>
        </div>
      </section>

      {/* AI Chat Teaser */}
      <section className="py-24 border-b border-border ascii-bg">
        <div className="container-wide text-center">
          <p className="mono-xs text-muted-foreground mb-4">// AI ASSISTANT</p>
          <h2 className="heading-lg mb-4">{dict.home.chatIntro}</h2>
          <p className="body-md text-muted-foreground max-w-lg mx-auto mb-8">
            {dict.home.chatDescription}
          </p>
          <Link href={`/${lang}/chat`} className="btn-primary inline-block">
            {dict.home.startChat} →
          </Link>
        </div>
      </section>

      {/* Contact Teaser */}
      <section className="py-24">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="mono-xs text-muted-foreground mb-4">// CONTACT</p>
              <h2 className="heading-lg mb-4">{dict.home.contactTeaser}</h2>
              <p className="body-md text-muted-foreground mb-6">
                {getLocalizedText(profile.affiliation, locale)}
              </p>
              <Link href={`/${lang}/contact`} className="btn-primary inline-block">
                {dict.home.learnMore} →
              </Link>
            </div>
            <div className="font-mono text-[10px] text-muted-foreground/20 leading-tight select-none hidden md:block">
              <pre>
{`╔═════════════════════════════╗
║  PROF. JONGCHEON SHIN         ║
║  AI · ART · CULTURE           ║
║  SANGJI UNIVERSITY            ║
║  ══════════════════════════   ║
║  shin7942@sangji.ac.kr        ║
╚══════════════════════════════╝`}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
