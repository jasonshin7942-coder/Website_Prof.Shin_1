export const i18nConfig = {
  locales: ['ko', 'en', 'zh'] as const,
  defaultLocale: 'ko' as const,
};

export type Locale = (typeof i18nConfig)['locales'][number];

export function isValidLocale(locale: string): locale is Locale {
  return i18nConfig.locales.includes(locale as Locale);
}
