'use client';

import * as React from 'react';
import { flexRender } from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BonusFormModal } from '@/components/bonus-form-modal';
import { DeleteConfirmDialog } from '@/components/delete-confirm-modal';
import { BonusTableToolbar } from '@/components/admin/bonus-table-toolbar';
import { BonusTablePagination } from '@/components/admin/bonus-table-pagination';
import { useBonusTable } from '@/hooks/use-bonus-table';

export default function AdminBonusesTable() {
  const {
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
  } = useBonusTable();

  return (
    <>
      <div className="w-full p-6">
        <BonusTableToolbar table={table} onAddBonus={openAddModal} />
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length} className="text-center">
                    No bonuses found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <BonusTablePagination table={table} />
      </div>
      <BonusFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editBonus ?? undefined}
        onSubmit={handleModalSubmit}
      />
      <DeleteConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Delete Bonus"
        description="Are you sure you want to delete this bonus? This action cannot be undone."
      />
    </>
  );
}
