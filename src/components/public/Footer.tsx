import Link from 'next/link';
import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

interface FooterProps {
  lang: Locale;
}

export default function Footer({ lang }: FooterProps) {
  const dict = getDictionary(lang);

  return (
    <footer className="border-t border-border bg-background mt-auto">
      {/* ASCII decoration */}
      <div className="overflow-hidden h-8 flex items-center justify-center">
        <p className="font-mono text-[9px] text-muted-foreground/30 tracking-[0.3em] whitespace-nowrap select-none">
          01001010 01000011 01010011 00100000 · 01000001 01001001 00100000 01000001 01110010 01110100 00100000 01000011 01110101 01101100 01110100
        </p>
      </div>

      <div className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Identity */}
          <div>
            <p className="font-semibold text-sm mb-2">
              {lang === 'ko' ? '신종천' : 'Jongcheon Shin'}
            </p>
            <p className="text-muted-foreground text-sm">
              {lang === 'ko' ? '상지대학교 문화콘텐츠학과 교수' : 'Professor of Cultural Content, Sangji University'}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="mono-xs text-muted-foreground mb-3">
              {lang === 'ko' ? '바로가기' : 'Quick Links'}
            </p>
            <div className="flex flex-col gap-1.5">
              <Link href={`/${lang}/research`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {dict.nav.research}
              </Link>
              <Link href={`/${lang}/teaching`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {dict.nav.teaching}
              </Link>
              <Link href={`/${lang}/publications`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {dict.nav.publications}
              </Link>
              <Link href={`/${lang}/activities`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {dict.nav.activities}
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="mono-xs text-muted-foreground mb-3">
              {lang === 'ko' ? '연락처' : 'Contact'}
            </p>
            <p className="text-sm text-muted-foreground">shin7942@sangji.ac.kr</p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {dict.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
