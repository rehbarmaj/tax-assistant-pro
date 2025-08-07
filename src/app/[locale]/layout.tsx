import type { ReactNode } from 'react';
import { I18nProviderClient } from '@/i18n/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from "@/components/ui/toaster";


export default function LocaleLayout({
  children,
  params: { locale },
}: Readonly<{
  children: ReactNode;
  params: { locale: string };
}>) {
  return (
    <I18nProviderClient locale={locale}>
      <TooltipProvider>
        {children}
        <Toaster />
      </TooltipProvider>
    </I18nProviderClient>
  );
}
