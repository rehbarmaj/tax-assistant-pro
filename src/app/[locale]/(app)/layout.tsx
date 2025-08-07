
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useI18n, useCurrentLocale, I18nProviderClient } from '@/i18n/client';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  Percent,
  Calculator,
  FileText,
  Landmark,
  Menu,
  ArrowBigUpDash,
  ArrowBigDownDash,
  BookCopy,
  ShoppingCart,
  ClipboardList,
  Undo2,
  Redo2,
  Users,
  ShieldCheck,
  Building,
  DatabaseBackup,
  Settings as SettingsIcon,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Toaster } from "@/components/ui/toaster";


const navItems = [
  { href: '/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
  { href: '/income-tax-estimator', labelKey: 'incomeTaxEstimator', icon: Calculator },
  { href: '/reports', labelKey: 'reports', icon: FileText },
  {
    labelKey: 'transactions', icon: BookCopy, children: [
      { href: '/purchase-notes', labelKey: 'purchaseNotes', icon: ShoppingCart },
      { href: '/purchase-returns', labelKey: 'purchaseReturns', icon: Undo2 },
      { href: '/sale-notes', labelKey: 'saleNotes', icon: ClipboardList },
      { href: '/sales-returns', labelKey: 'salesReturns', icon: Redo2 },
      { href: '/payment-vouchers', labelKey: 'paymentVouchers', icon: ArrowBigUpDash },
      { href: '/receipt-vouchers', labelKey: 'receiptVouchers', icon: ArrowBigDownDash },
      { href: '/journal-vouchers', labelKey: 'journalVouchers', icon: BookCopy },
    ]
  },
  {
    labelKey: 'mastersAndSettings', icon: SettingsIcon, children: [
      { href: '/accounts', labelKey: 'accounts', icon: Landmark },
      { href: '/products', labelKey: 'products', icon: Package },
      { href: '/parties', labelKey: 'parties', icon: Users },
      { href: '/tax-rates', labelKey: 'taxRates', icon: Percent },
      { href: '/financial-year-closing', labelKey: 'financialYearClosing', icon: Calculator },
      { href: '/user-rights', labelKey: 'userRights', icon: ShieldCheck },
      { href: '/settings', labelKey: 'settings', icon: Building },
      { href: '/backup', labelKey: 'backupAndRestore', icon: DatabaseBackup },
    ]
  },
];

export default function AppLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  return (
    <I18nProviderClient locale={locale}>
      <TooltipProvider>
        <AppLayoutContent>
            {children}
        </AppLayoutContent>
        <Toaster />
      </TooltipProvider>
    </I18nProviderClient>
  );
}


function AppLayoutContent({ children }: { children: ReactNode }) {
  const t = useI18n();
  const locale = useCurrentLocale();

  return (
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="icon" variant="sidebar" side={locale === 'ur' ? 'right' : 'left'}>
          <SidebarHeader className="h-16 flex items-center justify-between p-4">
            <Link href="/dashboard" className="flex items-center gap-2" aria-label="Tax Assistant Pro Home">
              <Logo />
              <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">Tax Assistant Pro</span>
            </Link>
          </SidebarHeader>
          <SidebarContent asChild>
            <ScrollArea className="h-full">
              <SidebarMenu className="p-4 pt-0">
                {navItems.map((item) => item.href ? (
                  <SidebarMenuItem key={item.href}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton href={`/${locale}${item.href}`} className="justify-start">
                          <item.icon className="h-5 w-5" />
                          <span>{t(item.labelKey as any)}</span>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side={locale === 'ur' ? 'left' : 'right'} align="center">
                        {t(item.labelKey as any)}
                      </TooltipContent>
                    </Tooltip>
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem key={item.labelKey}>
                    <SidebarMenuButton className="justify-start">
                      <item.icon className="h-5 w-5" />
                      <span>{t(item.labelKey as any)}</span>
                    </SidebarMenuButton>
                    <SidebarMenu>
                      {item.children?.map(subItem => (
                        <SidebarMenuItem key={subItem.href}>
                           <Tooltip>
                              <TooltipTrigger asChild>
                                <SidebarMenuButton href={`/${locale}${subItem.href}`} className="justify-start">
                                  <subItem.icon className="h-5 w-5" />
                                  <span>{t(subItem.labelKey as any)}</span>
                                </SidebarMenuButton>
                              </TooltipTrigger>
                              <TooltipContent side={locale === 'ur' ? 'left' : 'right'} align="center">
                                {t(subItem.labelKey as any)}
                              </TooltipContent>
                            </Tooltip>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </ScrollArea>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
            <div className="md:hidden">
              <SidebarTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SidebarTrigger>
            </div>
            <div className="flex-1">
              {/* Can add breadcrumbs or page title here */}
            </div>
            <LanguageSwitcher />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="user avatar" />
                    <AvatarFallback>TA</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('myAccount')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{t('settings')}</DropdownMenuItem>
                <DropdownMenuItem>{t('support')}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{t('logout')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
  );
}
