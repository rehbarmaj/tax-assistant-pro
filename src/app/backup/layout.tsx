
import type { ReactNode } from 'react';
import AppLayout from '../app-layout';

export default function BackupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
