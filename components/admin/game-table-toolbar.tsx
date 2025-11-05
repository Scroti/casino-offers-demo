'use client';

import * as React from 'react';
import { Table } from '@tanstack/react-table';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Game } from '@/app/lib/data-access/models/game.model';

interface GameTableToolbarProps {
  table: Table<Game>;
  onAddGame: () => void;
}

export function GameTableToolbar({ table, onAddGame }: GameTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between py-4">
      <Input
        placeholder="Filter games..."
        value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
        onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
        className="max-w-sm"
      />
      <div className="flex items-center gap-2">
        {existingGames.length === 0 && (
          <Button onClick={handleSeedGames} disabled={isSeeding} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {isSeeding ? 'Seeding...' : 'Seed Games from Constants'}
          </Button>
        )}
        <Button onClick={onAddGame}>
          <Plus className="mr-2 h-4 w-4" />
          Add Game
        </Button>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
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
      </div>
    </div>
  );
}

