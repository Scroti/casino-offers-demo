'use client';

import {
  useGetAllGamesQuery,
  useCreateGameMutation,
  useUpdateGameMutation,
  useDeleteGameMutation,
} from '@/app/lib/data-access/configs/games.config';
import type { Game } from '@/app/lib/data-access/models/game.model';
import { createGameTableColumns } from '@/components/admin/game-table-columns';
import { makeAdminTableHook } from './use-admin-table';

const _useGameTable = makeAdminTableHook<Game>({
  useListQuery: useGetAllGamesQuery,
  useCreateMutation: useCreateGameMutation,
  useUpdateMutation: useUpdateGameMutation,
  useDeleteMutation: useDeleteGameMutation,
  buildUpdateArgs: (id, data) => ({ id, data }),
  createColumns: ({ onEdit, onDelete }) =>
    createGameTableColumns({ onEditGame: onEdit, onDeleteGame: onDelete }),
});

export function useGameTable() {
  const { editItem, ...rest } = _useGameTable();
  return { ...rest, editGame: editItem };
}
