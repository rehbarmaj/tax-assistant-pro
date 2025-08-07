import type { ReactNode } from 'react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { I18nProviderClient } from '@/i18n/client';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale;
  return (
    <html lang={locale} dir={locale === 'ur' ? 'rtl' : 'ltr'}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <I18nProviderClient locale={locale}>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </I18nProviderClient>
      </body>
    </html>
  );
}
