import type { ReactNode } from 'react';
import AppLayoutClient from './(app)/layout';

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  return <AppLayoutClient locale={locale}>{children}</AppLayoutClient>;
}
