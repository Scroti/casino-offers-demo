'use client';

import {
  useGetAllBonusesQuery,
  useCreateBonusMutation,
  useUpdateBonusMutation,
  useDeleteBonusMutation,
} from '@/app/lib/data-access/configs/bonuses.config';
import type { Bonus } from '@/app/lib/data-access/models/bonus.model';
import { createBonusTableColumns } from '@/components/admin/bonus-table-columns';
import { makeAdminTableHook } from './use-admin-table';

const _useBonusTable = makeAdminTableHook<Bonus>({
  useListQuery: useGetAllBonusesQuery,
  useCreateMutation: useCreateBonusMutation,
  useUpdateMutation: useUpdateBonusMutation,
  useDeleteMutation: useDeleteBonusMutation,
  buildUpdateArgs: (id, bonus) => ({ id, bonus }),
  createColumns: ({ onEdit, onDelete }) =>
    createBonusTableColumns({ onEditBonus: onEdit, onDeleteBonus: onDelete }),
});

export function useBonusTable() {
  const { editItem, ...rest } = _useBonusTable();
  return { ...rest, editBonus: editItem };
}
