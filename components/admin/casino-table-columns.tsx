'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CasinoTableImage } from './casino-table-image';
import { CasinoTableActions } from './casino-table-actions';
import type { Casino } from '@/app/lib/data-access/models/casino.model';

interface CasinoTableColumnsProps {
  onEditCasino: (casino: Casino) => void;
  onDeleteCasino: (casinoId: string) => void;
}

export function createCasinoTableColumns({
  onEditCasino,
  onDeleteCasino,
}: CasinoTableColumnsProps): ColumnDef<Casino>[] {
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
      accessorKey: 'name',
      header: ({ column }) => (
        <button
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="inline-flex items-center gap-2 hover:bg-accent hover:text-accent-foreground h-8 px-3 rounded-md text-sm font-medium transition-colors"
        >
          Name
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => row.getValue('name'),
    },
    {
      accessorKey: 'safetyIndex',
      header: ({ column }) => (
        <button
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="inline-flex items-center gap-2 hover:bg-accent hover:text-accent-foreground h-8 px-3 rounded-md text-sm font-medium transition-colors"
        >
          Safety Index
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => {
        const value = row.getValue('safetyIndex') as number | undefined;
        return value ? value.toFixed(1) : '-';
      },
    },
    {
      accessorKey: 'countryCode',
      header: 'Country',
      cell: ({ row }) => {
        const countryCode = row.getValue('countryCode') as string | undefined;
        const countryFlag = row.original.countryFlag;
        return countryCode ? `${countryFlag || ''} ${countryCode}` : '-';
      },
    },
    {
      accessorKey: 'logo',
      header: 'Logo',
      cell: ({ row }) => {
        const logo = row.getValue('logo') as string | undefined;
        return logo ? <CasinoTableImage imageUrl={logo} /> : '-';
      },
    },
    {
      accessorKey: 'image',
      header: 'Image',
      cell: ({ row }) => {
        const image = row.getValue('image') as string | undefined;
        return image ? <CasinoTableImage imageUrl={image} /> : '-';
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const casino = row.original;
        return (
          <CasinoTableActions
            casino={casino}
            onEdit={onEditCasino}
            onDelete={onDeleteCasino}
          />
        );
      },
    },
  ];
}

