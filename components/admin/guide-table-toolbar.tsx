'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table } from '@tanstack/react-table';
import type { Guide } from '@/app/lib/data-access/configs/guides.config';

interface GuideTableToolbarProps {
  table: Table<Guide>;
  onAddGuide: () => void;
}

export function GuideTableToolbar({ table, onAddGuide }: GuideTableToolbarProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <Input
        placeholder="Filter guides by title..."
        value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
        onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
        className="max-w-sm"
      />
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={onAddGuide} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Guide
        </Button>
      </div>
    </div>
  );
}

