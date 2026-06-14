'use client';

import {
  useGetAllCasinosQuery,
  useCreateCasinoMutation,
  useUpdateCasinoMutation,
  useDeleteCasinoMutation,
} from '@/app/lib/data-access/configs/casinos.config';
import type { Casino } from '@/app/lib/data-access/models/casino.model';
import { createCasinoTableColumns } from '@/components/admin/casino-table-columns';
import { makeAdminTableHook } from './use-admin-table';

const _useCasinoTable = makeAdminTableHook<Casino>({
  useListQuery: useGetAllCasinosQuery,
  useCreateMutation: useCreateCasinoMutation,
  useUpdateMutation: useUpdateCasinoMutation,
  useDeleteMutation: useDeleteCasinoMutation,
  buildUpdateArgs: (id, casino) => ({ id, casino }),
  createColumns: ({ onEdit, onDelete }) =>
    createCasinoTableColumns({ onEditCasino: onEdit, onDeleteCasino: onDelete }),
});

export function useCasinoTable() {
  const { editItem, ...rest } = _useCasinoTable();
  return { ...rest, editCasino: editItem };
}
