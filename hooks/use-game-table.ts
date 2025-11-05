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
  useGetAllGamesQuery,
  useCreateGameMutation,
  useUpdateGameMutation,
  useDeleteGameMutation,
} from '@/app/lib/data-access/configs/games.config';
import type { Game } from '@/app/lib/data-access/models/game.model';
import { createGameTableColumns } from '@/components/admin/game-table-columns';

export function useGameTable() {
  const { data = [], isLoading } = useGetAllGamesQuery();
  const [createGame] = useCreateGameMutation();
  const [updateGame] = useUpdateGameMutation();
  const [deleteGame] = useDeleteGameMutation();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editGame, setEditGame] = React.useState<Game | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const openAddModal = () => {
    setEditGame(null);
    setModalOpen(true);
  };

  const openEditModal = (game: Game) => {
    setEditGame(game);
    setModalOpen(true);
  };

  const handleModalSubmit = async (data: Partial<Game>) => {
    try {
      if (editGame?._id) {
        await updateGame({ id: editGame._id, data }).unwrap();
      } else {
        await createGame(data).unwrap();
      }
      setModalOpen(false);
      setEditGame(null);
    } catch (error) {
      console.error('Failed to save game:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteGame(deleteId).unwrap();
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete game:', error);
    } finally {
      setDeleting(false);
    }
  };

  const columns = React.useMemo(
    () => createGameTableColumns({
      onEditGame: openEditModal,
      onDeleteGame: setDeleteId,
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
    editGame,
    deleteId,
    deleting,
    setModalOpen,
    handleModalSubmit,
    setDeleteId,
    handleDeleteConfirm,
    openAddModal,
  };
}

