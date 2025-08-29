
import type { ReactNode } from 'react';
import AppLayout from '../app-layout';

export default function ReportsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
