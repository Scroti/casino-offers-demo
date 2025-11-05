'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { GuideTableActions } from './guide-table-actions';
import type { Guide } from '@/app/lib/data-access/configs/guides.config';

interface GuideTableColumnsProps {
  onEditGuide: (guide: Guide) => void;
  onDeleteGuide: (guideId: string) => void;
}

export function createGuideTableColumns({
  onEditGuide,
  onDeleteGuide,
}: GuideTableColumnsProps): ColumnDef<Guide>[] {
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
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('title')}</div>
      ),
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">{row.getValue('slug')}</div>
      ),
    },
    {
      accessorKey: 'excerpt',
      header: 'Excerpt',
      cell: ({ row }) => {
        const excerpt = row.getValue('excerpt') as string | undefined;
        return (
          <div className="text-sm max-w-xs truncate">{excerpt || '-'}</div>
        );
      },
    },
    {
      accessorKey: 'categories',
      header: 'Categories',
      cell: ({ row }) => {
        const categories = row.getValue('categories') as string[] | undefined;
        if (!categories || categories.length === 0) return '-';
        return (
          <div className="flex flex-wrap gap-1">
            {categories.slice(0, 2).map((cat) => (
              <Badge key={cat} variant="secondary" className="text-xs">
                {cat}
              </Badge>
            ))}
            {categories.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{categories.length - 2}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'isPublished',
      header: 'Status',
      cell: ({ row }) => {
        const isPublished = row.getValue('isPublished') as boolean;
        return (
          <Badge variant={isPublished ? 'default' : 'secondary'}>
            {isPublished ? 'Published' : 'Draft'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'isFeatured',
      header: 'Featured',
      cell: ({ row }) => {
        const isFeatured = row.getValue('isFeatured') as boolean;
        return isFeatured ? (
          <Badge variant="default">Featured</Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: 'views',
      header: ({ column }) => (
        <button
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="inline-flex items-center gap-2 hover:bg-accent hover:text-accent-foreground h-8 px-3 rounded-md text-sm font-medium transition-colors"
        >
          Views
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => {
        const views = row.getValue('views') as number;
        return <div className="text-sm">{views || 0}</div>;
      },
    },
    {
      accessorKey: 'publishedAt',
      header: ({ column }) => (
        <button
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="inline-flex items-center gap-2 hover:bg-accent hover:text-accent-foreground h-8 px-3 rounded-md text-sm font-medium transition-colors"
        >
          Published
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => {
        const date = row.getValue('publishedAt') as string | undefined;
        return (
          <div className="text-sm">
            {date ? new Date(date).toLocaleDateString() : '-'}
          </div>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const guide = row.original;
        return (
          <GuideTableActions
            guide={guide}
            onEdit={onEditGuide}
            onDelete={onDeleteGuide}
          />
        );
      },
    },
  ];
}

