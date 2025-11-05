'use client';

import * as React from 'react';
import { Table } from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Casino } from '@/app/lib/data-access/models/casino.model';

interface CasinoTableToolbarProps {
  table: Table<Casino>;
  onAddCasino: () => void;
}

export function CasinoTableToolbar({ table, onAddCasino }: CasinoTableToolbarProps) {
  return (
    <div className="flex items-center py-4">
      <Input
        placeholder="Filter name..."
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onChange={(event) =>
          table.getColumn('name')?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
      <Button className="ml-auto" onClick={onAddCasino}>
        Add Casino
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-2">
            Columns <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) =>
                  column.toggleVisibility(!!value)
                }
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

