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
import { CasinoFormModal } from '@/components/casino-form-modal';
import { DeleteConfirmDialog } from '@/components/delete-confirm-modal';
import { CasinoTableToolbar } from '@/components/admin/casino-table-toolbar';
import { CasinoTablePagination } from '@/components/admin/casino-table-pagination';
import { useCasinoTable } from '@/hooks/use-casino-table';

export default function AdminCasinosTable() {
  const {
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
  } = useCasinoTable();

  return (
    <>
      <div className="w-full p-6">
        <CasinoTableToolbar table={table} onAddCasino={openAddModal} />
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
                    No casinos found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <CasinoTablePagination table={table} />
      </div>
      <CasinoFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editCasino ?? undefined}
        onSubmit={handleModalSubmit}
      />
      <DeleteConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Delete Casino"
        description="Are you sure you want to delete this casino? This action cannot be undone."
      />
    </>
  );
}

