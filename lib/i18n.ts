export const locales = ['zh', 'en', 'ja', 'ko'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'zh';

export const localeNames: Record<Locale, string> = {
  zh: '中文',
  en: 'English',
  ja: '日本語',
  ko: '한국어'
};

export function getLocaleFromUrl(pathname: string): Locale {
  const segments = pathname.split('/');
  const locale = segments[1] as Locale;
  return locales.includes(locale) ? locale : defaultLocale;
}

export function removeLocaleFromUrl(pathname: string): string {
  const segments = pathname.split('/');
  if (locales.includes(segments[1] as Locale)) {
    return '/' + segments.slice(2).join('/');
  }
  return pathname;
}