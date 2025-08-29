
import type { ReactNode } from 'react';
import AppLayout from '../app-layout';

export default function JournalVouchersLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
