'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { GameTableActions } from './game-table-actions';
import type { Game } from '@/app/lib/data-access/models/game.model';

interface GameTableColumnsProps {
  onEditGame: (game: Game) => void;
  onDeleteGame: (gameId: string) => void;
}

export function createGameTableColumns({
  onEditGame,
  onDeleteGame,
}: GameTableColumnsProps): ColumnDef<Game>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <button
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="inline-flex items-center gap-2 hover:bg-accent hover:text-accent-foreground h-8 px-3 rounded-md text-sm font-medium transition-colors"
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => row.getValue('title'),
    },
    {
      accessorKey: 'gameId',
      header: 'Game ID',
      cell: ({ row }) => (
        <code className="text-xs bg-muted px-2 py-1 rounded">{row.getValue('gameId')}</code>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => row.getValue('category'),
    },
    {
      accessorKey: 'provider',
      header: 'Provider',
      cell: ({ row }) => row.getValue('provider'),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => {
        const isActive = row.getValue('isActive') as boolean;
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'views',
      header: 'Views',
      cell: ({ row }) => row.getValue('views') || 0,
    },
    {
      accessorKey: 'plays',
      header: 'Plays',
      cell: ({ row }) => row.getValue('plays') || 0,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <GameTableActions
          game={row.original}
          onEdit={onEditGame}
          onDelete={onDeleteGame}
        />
      ),
    },
  ];
}

