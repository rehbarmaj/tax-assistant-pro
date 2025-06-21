

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
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/tax-rates', label: 'Tax Rates', icon: Percent },
  { href: '/accounts', label: 'Accounts', icon: Landmark },
  { href: '/purchase-notes', label: 'Purchase Notes', icon: ShoppingCart },
  { href: '/purchase-returns', label: 'Purchase Returns', icon: Undo2 },
  { href: '/sale-notes', label: 'Sale Notes', icon: ClipboardList },
  { href: '/sales-returns', label: 'Sale Returns', icon: Redo2 },
  { href: '/payment-vouchers', label: 'Payment Vouchers', icon: ArrowBigUpDash },
  { href: '/receipt-vouchers', label: 'Receipt Vouchers', icon: ArrowBigDownDash },
  { href: '/journal-vouchers', label: 'Journal Vouchers', icon: BookCopy },
  { href: '/income-tax-estimator', label: 'Income Tax Estimator', icon: Calculator },
  { href: '/reports', label: 'Reports', icon: FileText },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" variant="sidebar" side="left">
        <SidebarHeader className="h-16 flex items-center justify-between p-4">
          <Link href="/dashboard" className="flex items-center gap-2" aria-label="Tax Assistant Pro Home">
            <Logo />
            <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">Tax Assistant Pro</span>
          </Link>
        </SidebarHeader>
        <SidebarContent asChild>
          <ScrollArea className="h-full">
            <SidebarMenu className="p-4 pt-0">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} asChild>
                    <SidebarMenuButton
                      tooltip={{children: item.label, side: "right", align: "center"}}
                      className="justify-start"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
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
  );
}
