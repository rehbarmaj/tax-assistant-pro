import type { ReactNode } from 'react';
import { I18nProviderClient } from '@/i18n/client';

export default function LocaleLayout({
  children,
  params: { locale },
}: Readonly<{
  children: ReactNode;
  params: { locale: string };
}>) {
  return (
    <I18nProviderClient locale={locale}>
      {/* The dir attribute is now managed by the main application layout */}
      {children}
    </I18nProviderClient>
  );
}
