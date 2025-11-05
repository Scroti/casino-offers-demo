'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { flexRender } from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { GameFormModal } from '@/components/game-form-modal';
import { DeleteConfirmDialog } from '@/components/delete-confirm-modal';
import { GameTableToolbar } from '@/components/admin/game-table-toolbar';
import { GameTablePagination } from '@/components/admin/game-table-pagination';
import { useGameTable } from '@/hooks/use-game-table';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

function AdminGamesTableContent() {
  const {
    table,
    isLoading,
    modalOpen,
    editGame,
    deleteId,
    deleting,
    openAddModal,
    setModalOpen,
    handleModalSubmit,
    setDeleteId,
    handleDeleteConfirm,
  } = useGameTable();

  return (
    <>
      <div className="w-full p-6">
        <GameTableToolbar table={table} onAddGame={openAddModal} />
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
                    No games found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <GameTablePagination table={table} />
      </div>
      <GameFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editGame ?? undefined}
        onSubmit={handleModalSubmit}
      />
      <DeleteConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Delete Game"
        description="Are you sure you want to delete this game? This action cannot be undone."
      />
    </>
  );
}

export default function AdminGamesTable() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <p>Loading games...</p>
      </div>
    }>
      <AdminGamesTableContent />
    </Suspense>
  );
}

