
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
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
  SidebarFooter,
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
  Book,
  Warehouse,
  FileBox,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { LayoutSwitcher } from '@/components/layout-switcher';

const navItems = [
  {
    label: 'General', icon: Book, children: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/income-tax-estimator', label: 'AI Tax Estimator', icon: Calculator },
      { href: '/reports', label: 'Reports', icon: FileText },
    ]
  },
  {
    label: 'Masters', icon: DatabaseBackup, children: [
        { href: '/accounts', label: 'Chart of Accounts', icon: Landmark },
        { href: '/products', label: 'Products', icon: Package },
        { href: '/parties', label: 'Clients & Vendors', icon: Users },
        { href: '/tax-rates', label: 'Tax Rates', icon: Percent },
    ]
  },
  {
    label: 'Inventory', icon: Warehouse, children: [
      { href: '/purchase-notes', label: 'Purchase Notes', icon: ShoppingCart },
      { href: '/purchase-returns', label: 'Purchase Returns', icon: Undo2 },
      { href: '/sale-notes', label: 'Sale Notes', icon: ClipboardList },
      { href: '/sales-returns', label: 'Sales Returns', icon: Redo2 },
    ]
  },
  {
    label: 'Transactions', icon: FileBox, children: [
      { href: '/payment-vouchers', label: 'Payment Vouchers', icon: ArrowBigUpDash },
      { href: '/receipt-vouchers', label: 'Receipt Vouchers', icon: ArrowBigDownDash },
      { href: '/journal-vouchers', label: 'Journal Vouchers', icon: BookCopy },
    ]
  },
];

const settingsNavItems = [
    { href: '/user-rights', label: 'User Rights', icon: ShieldCheck },
    { href: '/financial-year-closing', label: 'Financial Year Closing', icon: Calculator },
    { href: '/backup', label: 'Backup & Restore', icon: DatabaseBackup },
    { href: '/settings', label: 'Company Settings', icon: Building },
]


export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
      <TooltipProvider>
        <SidebarProvider>
            <Sidebar>
            <SidebarHeader>
                <Link href="/dashboard" className="flex items-center gap-2" aria-label="Tax Assistant Pro Home">
                <Logo />
                <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">Tax Assistant Pro</span>
                </Link>
            </SidebarHeader>
            <SidebarContent asChild>
                <ScrollArea className="h-full">
                <SidebarMenu>
                    {navItems.map((group) => (
                    <SidebarMenuItem key={group.label} className="mt-2">
                        <SidebarMenuButton className="justify-start pointer-events-none text-muted-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:text-xs group-data-[collapsible=icon]:h-auto group-data-[collapsible=icon]:py-1">
                            <group.icon />
                            <span className="group-data-[collapsible=icon]:hidden">{group.label}</span>
                        </SidebarMenuButton>
                        <SidebarMenu>
                        {group.children?.map(subItem => (
                            <SidebarMenuItem key={subItem.href}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <SidebarMenuButton href={subItem.href} className="justify-start">
                                    <subItem.icon />
                                    <span>{subItem.label}</span>
                                    </SidebarMenuButton>
                                </TooltipTrigger>
                                <TooltipContent side='right' align="center">
                                    {subItem.label}
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
            <SidebarFooter>
                <SidebarMenu>
                    {settingsNavItems.map(item => (
                        <SidebarMenuItem key={item.href}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <SidebarMenuButton href={item.href} className="justify-start">
                                        <item.icon />
                                        <span>{item.label}</span>
                                    </SidebarMenuButton>
                                </TooltipTrigger>
                                <TooltipContent side="right" align="center">
                                    {item.label}
                                </TooltipContent>
                            </Tooltip>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarFooter>
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
                <LayoutSwitcher />
                <ThemeSwitcher />
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                        <AvatarImage src="https://picsum.photos/40/40" alt="User Avatar" data-ai-hint="user avatar" />
                        <AvatarFallback>TA</AvatarFallback>
                    </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </header>
            <main className="flex-1 p-4 md:p-6 lg:p-8">
                {children}
            </main>
            </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
  );
}
