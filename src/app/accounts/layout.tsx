
import type { ReactNode } from 'react';
import AppLayout from '../app-layout';

export default function AccountsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
