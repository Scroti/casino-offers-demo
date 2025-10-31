'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { BonusTableImage } from './bonus-table-image';
import { BonusTableActions } from './bonus-table-actions';
import type { Bonus } from '@/app/lib/data-access/models/bonus.model';

interface BonusTableColumnsProps {
  onEditBonus: (bonus: Bonus) => void;
  onDeleteBonus: (bonusId: string) => void;
}

export function createBonusTableColumns({
  onEditBonus,
  onDeleteBonus,
}: BonusTableColumnsProps): ColumnDef<Bonus>[] {
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
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => row.getValue('title'),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        const val = row.getValue('description') as any;
        const text = typeof val === 'string' ? val : (val?.title || val?.content || '');
        return <div className="text-sm max-w-xs truncate">{text}</div>;
      },
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => row.getValue('price'),
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: ({ row }) => row.getValue('rating'),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => row.getValue('type'),
    },
    {
      accessorKey: 'casinoImage',
      header: 'Image',
      cell: ({ row }) => {
        const image = row.getValue('casinoImage') as string;
        return <BonusTableImage imageUrl={image} />;
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const bonus = row.original;
        return (
          <BonusTableActions
            bonus={bonus}
            onEdit={onEditBonus}
            onDelete={onDeleteBonus}
          />
        );
      },
    },
  ];
}
