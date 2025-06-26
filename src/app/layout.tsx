import type { ReactNode } from 'react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

// This is the root layout. It's kept minimal to allow the localized layout to control the main HTML structure.
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
        {children}
        <Toaster />
    </>
  );
}
