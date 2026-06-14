'use client';

import {
  useGetAllGuidesQuery,
  useCreateGuideMutation,
  useUpdateGuideMutation,
  useDeleteGuideMutation,
} from '@/app/lib/data-access/configs/guides.config';
import type { Guide } from '@/app/lib/data-access/models/guide.model';
import { createGuideTableColumns } from '@/components/admin/guide-table-columns';
import { makeAdminTableHook } from './use-admin-table';

const useAllGuidesQuery = () => useGetAllGuidesQuery({ published: false });

const _useGuideTable = makeAdminTableHook<Guide>({
  useListQuery: useAllGuidesQuery,
  useCreateMutation: useCreateGuideMutation,
  useUpdateMutation: useUpdateGuideMutation,
  useDeleteMutation: useDeleteGuideMutation,
  buildUpdateArgs: (id, guide) => ({ id, guide }),
  createColumns: ({ onEdit, onDelete }) =>
    createGuideTableColumns({ onEditGuide: onEdit, onDeleteGuide: onDelete }),
});

export function useGuideTable() {
  const { editItem, ...rest } = _useGuideTable();
  return { ...rest, editGuide: editItem };
}
