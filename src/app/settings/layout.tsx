
import type { ReactNode } from 'react';
import AppLayout from '../app-layout';

export default function SettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
