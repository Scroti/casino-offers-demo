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
import { GuideFormModal } from '@/components/guide-form-modal';
import { DeleteConfirmDialog } from '@/components/delete-confirm-modal';
import { GuideTableToolbar } from '@/components/admin/guide-table-toolbar';
import { GuideTablePagination } from '@/components/admin/guide-table-pagination';
import { useGuideTable } from '@/hooks/use-guide-table';

function AdminGuidesTableContent() {
  const {
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
  } = useGuideTable();

  return (
    <>
      <div className="w-full p-6">
        <GuideTableToolbar table={table} onAddGuide={openAddModal} />
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
                    No guides found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <GuideTablePagination table={table} />
      </div>
      <GuideFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editGuide}
        onSubmit={handleModalSubmit}
      />
      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        deleting={deleting}
        title="Delete Guide"
        description="Are you sure you want to delete this guide? This action cannot be undone."
      />
    </>
  );
}

export default function AdminGuidesTable() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <p>Loading guides...</p>
      </div>
    }>
      <AdminGuidesTableContent />
    </Suspense>
  );
}

