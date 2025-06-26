import { createI18n } from 'next-international';

export const { useI18n, useScopedI18n, I18nProvider, getLocale, setLocale, getI18n, getScopedI18n } =
  createI18n({
    en: () => import('../locales/en'),
    ur: () => import('../locales/ur'),
  });
