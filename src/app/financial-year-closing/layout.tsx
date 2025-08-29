
import type { ReactNode } from 'react';
import AppLayout from '../app-layout';

export default function FinancialYearClosingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
