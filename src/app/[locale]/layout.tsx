import type { ReactNode } from 'react';
import { AppLayoutClient } from './app-layout-client';

export default function RootLocaleLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  return (
    <AppLayoutClient locale={locale}>
      {children}
    </AppLayoutClient>
  );
}
