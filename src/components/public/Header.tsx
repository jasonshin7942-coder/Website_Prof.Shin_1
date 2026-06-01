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
    { href: `/${lang}/publications`, label: dict.nav.publications },
    { href: `/${lang}/teaching`, label: dict.nav.teaching },
    { href: `/${lang}/activities`, label: dict.nav.activities },
    { href: `/${lang}/chat`, label: dict.nav.chat },
    { href: `/${lang}/contact`, label: dict.nav.contact },
  ];

  const langOptions = [
    { code: 'ko', label: 'KR' },
    { code: 'en', label: 'EN' },
    { code: 'zh', label: 'CN' },
  ];

  const isActive = (href: string) => {
    if (href === `/${lang}`) return pathname === `/${lang}`;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      {/* Top ASCII micro-bar */}
      <div className="hidden md:block overflow-hidden h-5 bg-foreground/[0.02] border-b border-border/50">
        <p className="font-mono text-[8px] text-muted-foreground/20 tracking-[0.15em] text-center leading-[20px] select-none" aria-hidden="true">
          SYS.INIT &gt; 01001010.01000011.01010011 &gt; LOAD.MODULE &gt; AI.ART.CULTURE &gt; STATUS: ONLINE ■
        </p>
      </div>
      <div className="container-wide flex items-center justify-between h-16">
        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2 group min-w-0">
          <span className="hidden sm:inline font-mono text-xs tracking-widest text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity shrink-0">
            {lang === 'ko' ? "{ Prof. Shin's Lab }" : '{ 신교수의 연구실 }'}
          </span>
          <span className="font-semibold text-sm sm:text-base tracking-tight truncate">
            {lang === 'ko' ? '신교수의 연구실' : "Prof. Shin's Lab"}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-5 py-2 text-[15px] font-medium transition-colors ${
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
          <div className="flex items-center border border-border">
            {langOptions.map((opt) => (
              <Link
                key={opt.code}
                href={pathname.replace(`/${lang}`, `/${opt.code}`)}
                className={`mono-xs px-3 py-2 min-w-[2.5rem] text-center transition-colors ${
                  lang === opt.code
                    ? 'bg-foreground text-background'
                    : 'hover:border-foreground text-muted-foreground hover:text-foreground'
                }`}
              >
                {opt.label}
              </Link>
            ))}
          </div>

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
        <nav className="lg:hidden border-t border-border bg-background overflow-y-auto max-h-[calc(100dvh-64px)]">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-6 py-4 text-[15px] border-b border-border transition-colors ${
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
