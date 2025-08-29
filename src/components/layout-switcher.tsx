
'use client';

import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sun, Moon, Layout, Square, ChevronsLeftRight } from 'lucide-react';
import * as React from 'react'

export function LayoutSwitcher() {
  const { setOpen } = useSidebar()
  const [variant, setVariant] = React.useState<'sidebar' | 'floating'>('sidebar')

  React.useEffect(() => {
    const root = document.querySelector('.group\\/sidebar-wrapper')
    if (root) {
      root.setAttribute('data-variant', variant)
    }
  }, [variant])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <ChevronsLeftRight />
          <span className="sr-only">Toggle Layout</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setVariant('sidebar')}>
          <Layout className="mr-2 h-4 w-4" />
          <span>Default</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setVariant('floating')}>
          <Square className="mr-2 h-4 w-4" />
          <span>Floating</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
