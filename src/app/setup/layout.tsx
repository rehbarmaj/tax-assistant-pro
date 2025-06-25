import type { ReactNode } from 'react';

export default function SetupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <main className="w-full">{children}</main>
    </div>
  );
}
