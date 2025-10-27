'use client';

import * as React from 'react';
import {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import {
  useGetAllBonusesQuery,
  useCreateBonusMutation,
  useUpdateBonusMutation,
  useDeleteBonusMutation,
} from '@/app/lib/data-access/configs/bonuses.config';
import type { Bonus } from '@/app/lib/data-access/models/bonus.model';
import { createBonusTableColumns } from '@/components/admin/bonus-table-columns';

export function useBonusTable() {
  const { data = [], isLoading } = useGetAllBonusesQuery();
  const [createBonus] = useCreateBonusMutation();
  const [updateBonus] = useUpdateBonusMutation();
  const [deleteBonus] = useDeleteBonusMutation();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editBonus, setEditBonus] = React.useState<Bonus | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const openAddModal = () => {
    setEditBonus(null);
    setModalOpen(true);
  };

  const openEditModal = (bonus: Bonus) => {
    setEditBonus(bonus);
    setModalOpen(true);
  };

  const handleModalSubmit = async (data: any) => {
    if (editBonus) {
      await updateBonus({ id: editBonus._id, bonus: data });
    } else {
      await createBonus(data);
    }
    setModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteBonus(deleteId).unwrap();
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete bonus', error);
    } finally {
      setDeleting(false);
    }
  };

  const columns = React.useMemo(
    () => createBonusTableColumns({
      onEditBonus: openEditModal,
      onDeleteBonus: setDeleteId,
    }),
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  });

  return {
    table,
    isLoading,
    modalOpen,
    editBonus,
    deleteId,
    deleting,
    openAddModal,
    setModalOpen,
    handleModalSubmit,
    setDeleteId,
    handleDeleteConfirm,
  };
}
