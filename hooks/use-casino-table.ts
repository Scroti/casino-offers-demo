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
  useGetAllCasinosQuery,
  useCreateCasinoMutation,
  useUpdateCasinoMutation,
  useDeleteCasinoMutation,
} from '@/app/lib/data-access/configs/casinos.config';
import type { Casino } from '@/app/lib/data-access/models/casino.model';
import { createCasinoTableColumns } from '@/components/admin/casino-table-columns';

export function useCasinoTable() {
  const { data = [], isLoading } = useGetAllCasinosQuery();
  const [createCasino] = useCreateCasinoMutation();
  const [updateCasino] = useUpdateCasinoMutation();
  const [deleteCasino] = useDeleteCasinoMutation();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editCasino, setEditCasino] = React.useState<Casino | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const openAddModal = () => {
    setEditCasino(null);
    setModalOpen(true);
  };

  const openEditModal = (casino: Casino) => {
    setEditCasino(casino);
    setModalOpen(true);
  };

  const handleModalSubmit = async (data: any) => {
    if (editCasino?._id) {
      await updateCasino({ id: editCasino._id, casino: data });
    } else {
      await createCasino(data);
    }
    setModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteCasino(deleteId).unwrap();
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete casino', error);
    } finally {
      setDeleting(false);
    }
  };

  const columns = React.useMemo(
    () => createCasinoTableColumns({
      onEditCasino: openEditModal,
      onDeleteCasino: setDeleteId,
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
    editCasino,
    deleteId,
    deleting,
    openAddModal,
    setModalOpen,
    handleModalSubmit,
    setDeleteId,
    handleDeleteConfirm,
  };
}

