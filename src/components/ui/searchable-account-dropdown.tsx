'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';


interface Account {
  id: string;
  code: string;
  name: string;
}

interface SearchableAccountDropdownProps {
  accounts: Account[];
  onSelect: (account: Account | null) => void;
  placeholder?: string;
  value?: Account | null;
}

const SearchableAccountDropdown: React.FC<SearchableAccountDropdownProps> = ({
  accounts,
  onSelect,
  placeholder = 'Select account',
  value,
}) => {
  const [open, setOpen] = React.useState(false);
  const [selectedAccount, setSelectedAccount] = React.useState<Account | null>(value || null);

  React.useEffect(() => {
    setSelectedAccount(value || null);
  }, [value]);

  const handleSelect = (account: Account) => {
    setSelectedAccount(account);
    onSelect(account);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between truncate font-normal"
        >
          {selectedAccount
            ? `${selectedAccount.code} - ${selectedAccount.name}`
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] max-h-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search account..." />
          <CommandList>
            <CommandEmpty>No account found.</CommandEmpty>
            <CommandGroup>
              {accounts.map((account) => (
                <CommandItem
                  key={account.id}
                  value={`${account.code} ${account.name}`} // Value for searching
                  onSelect={() => handleSelect(account)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedAccount?.id === account.id
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {`${account.code} - ${account.name}`}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchableAccountDropdown;
