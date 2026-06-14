'use client';

import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

interface AdminTableOptions<T extends { _id?: string }> {
  useListQuery: () => { data?: T[]; isLoading: boolean };
  useCreateMutation: () => readonly [(arg: Partial<T>) => any, any];
  useUpdateMutation: () => readonly [(arg: any) => any, any];
  useDeleteMutation: () => readonly [(id: string) => any, any];
  buildUpdateArgs: (id: string, data: Partial<T>) => unknown;
  createColumns: (callbacks: {
    onEdit: (item: T) => void;
    onDelete: (id: string) => void;
  }) => ColumnDef<T, any>[];
}

export function makeAdminTableHook<T extends { _id?: string }>(
  options: AdminTableOptions<T>
) {
  return function useAdminTable() {
    const { data = [], isLoading } = options.useListQuery();
    const [create] = options.useCreateMutation();
    const [update] = options.useUpdateMutation();
    const [remove] = options.useDeleteMutation();

    const [modalOpen, setModalOpen] = React.useState(false);
    const [editItem, setEditItem] = React.useState<T | null>(null);
    const [deleteId, setDeleteId] = React.useState<string | null>(null);
    const [deleting, setDeleting] = React.useState(false);

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const openAddModal = React.useCallback(() => {
      setEditItem(null);
      setModalOpen(true);
    }, []);

    const openEditModal = React.useCallback((item: T) => {
      setEditItem(item);
      setModalOpen(true);
    }, []);

    const handleModalSubmit = React.useCallback(
      async (data: Partial<T>) => {
        if (editItem?._id) {
          await update(options.buildUpdateArgs(editItem._id, data)).unwrap();
        } else {
          await create(data).unwrap();
        }
        setModalOpen(false);
        setEditItem(null);
      },
      [editItem, create, update]
    );

    const handleDeleteConfirm = React.useCallback(async () => {
      if (!deleteId) return;
      setDeleting(true);
      try {
        await remove(deleteId).unwrap();
        setDeleteId(null);
      } finally {
        setDeleting(false);
      }
    }, [deleteId, remove]);

    const columns = React.useMemo(
      () => options.createColumns({ onEdit: openEditModal, onDelete: setDeleteId }),
      [openEditModal]
    );

    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      state: { sorting, columnFilters, columnVisibility, rowSelection },
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
    });

    return {
      table,
      isLoading,
      modalOpen,
      editItem,
      deleteId,
      deleting,
      openAddModal,
      setModalOpen,
      handleModalSubmit,
      setDeleteId,
      handleDeleteConfirm,
    };
  };
}
