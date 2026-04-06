import { notFound } from 'next/navigation';
import { isValidLocale } from '@/i18n/config';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import type { Locale } from '@/i18n/config';

export function generateStaticParams() {
  return [{ lang: 'ko' }, { lang: 'en' }];
}

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <Header lang={lang as Locale} />
      <main className="flex-1">{children}</main>
      <Footer lang={lang as Locale} />
    </div>
  );
}
