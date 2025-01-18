import { defaultLanguage, supportedLanguages } from '@/settings/const';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: supportedLanguages,
  defaultLocale: defaultLanguage,
  localePrefix: {
    mode: 'always',
    prefixes: {
      'fr': '/fr',
      'tn': '/tn',
      'en': '/en',
    }
  },
  pathnames: {
    '/': '/',
  }
});