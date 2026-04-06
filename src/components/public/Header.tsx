'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

interface HeaderProps {
  lang: Locale;
}

export default function Header({ lang }: HeaderProps) {
  const dict = getDictionary(lang);
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: `/${lang}`, label: dict.nav.home },
    { href: `/${lang}/research`, label: dict.nav.research },
    { href: `/${lang}/teaching`, label: dict.nav.teaching },
    { href: `/${lang}/publications`, label: dict.nav.publications },
    { href: `/${lang}/activities`, label: dict.nav.activities },
    { href: `/${lang}/chat`, label: dict.nav.chat },
    { href: `/${lang}/contact`, label: dict.nav.contact },
  ];

  const otherLang = lang === 'ko' ? 'en' : 'ko';
  const switchPath = pathname.replace(`/${lang}`, `/${otherLang}`);

  const isActive = (href: string) => {
    if (href === `/${lang}`) return pathname === `/${lang}`;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container-wide flex items-center justify-between h-16">
        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-3 group">
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity">
            {'{ JCS }'}
          </span>
          <span className="font-semibold text-sm tracking-tight">
            {lang === 'ko' ? '신종천' : 'J. Shin'}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 text-[13px] font-medium transition-colors ${
                isActive(item.href)
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="block h-[1px] bg-foreground mt-0.5" />
              )}
            </Link>
          ))}
        </nav>

        {/* Language switch + mobile toggle */}
        <div className="flex items-center gap-3">
          <Link
            href={switchPath}
            className="mono-xs px-2 py-1 border border-border hover:border-foreground transition-colors"
          >
            {otherLang === 'ko' ? '한국어' : 'EN'}
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2"
            aria-label="Toggle menu"
          >
            <div className="space-y-1.5">
              <span className={`block w-5 h-[1.5px] bg-foreground transition-transform ${mobileOpen ? 'rotate-45 translate-y-[4.5px]' : ''}`} />
              <span className={`block w-5 h-[1.5px] bg-foreground transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-[1.5px] bg-foreground transition-transform ${mobileOpen ? '-rotate-45 -translate-y-[4.5px]' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-border bg-background">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-6 py-3 text-sm border-b border-border transition-colors ${
                isActive(item.href)
                  ? 'text-foreground bg-muted'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
