import type { ReactNode } from 'react';
import AppLayout from './app-layout';

export default function AppLocaleLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  return <AppLayout locale={locale}>{children}</AppLayout>;
}
