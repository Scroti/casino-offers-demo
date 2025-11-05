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
  useGetAllGuidesQuery,
  useCreateGuideMutation,
  useUpdateGuideMutation,
  useDeleteGuideMutation,
} from '@/app/lib/data-access/configs/guides.config';
import type { Guide } from '@/app/lib/data-access/configs/guides.config';
import { createGuideTableColumns } from '@/components/admin/guide-table-columns';

export function useGuideTable() {
  const { data = [], isLoading } = useGetAllGuidesQuery({ published: false });
  const [createGuide] = useCreateGuideMutation();
  const [updateGuide] = useUpdateGuideMutation();
  const [deleteGuide] = useDeleteGuideMutation();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editGuide, setEditGuide] = React.useState<Guide | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const openAddModal = () => {
    setEditGuide(null);
    setModalOpen(true);
  };

  const openEditModal = (guide: Guide) => {
    setEditGuide(guide);
    setModalOpen(true);
  };

  const handleModalSubmit = async (data: Partial<Guide>) => {
    console.log('handleModalSubmit called with data:', data);
    console.log('editGuide?._id:', editGuide?._id);
    
    try {
      if (editGuide?._id) {
        console.log('Updating guide:', editGuide._id, data);
        const result = await updateGuide({ id: editGuide._id, guide: data }).unwrap();
        console.log('Update result:', result);
      } else {
        console.log('Creating new guide:', data);
        const result = await createGuide(data).unwrap();
        console.log('Create result:', result);
      }
      setModalOpen(false);
      setEditGuide(null);
    } catch (error) {
      console.error('Failed to save guide:', error);
      // Don't close modal on error so user can fix issues
      throw error; // Re-throw to let form handle it
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteGuide(deleteId).unwrap();
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete guide', error);
    } finally {
      setDeleting(false);
    }
  };

  const columns = React.useMemo(
    () => createGuideTableColumns({
      onEditGuide: openEditModal,
      onDeleteGuide: setDeleteId,
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
    editGuide,
    deleteId,
    deleting,
    openAddModal,
    setModalOpen,
    handleModalSubmit,
    setDeleteId,
    handleDeleteConfirm,
  };
}

