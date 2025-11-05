'use client';

import * as React from 'react';
import { Suspense } from 'react';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  MoreHorizontal,
  Plus,
  Copy,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  useGetAllCampaignsQuery,
  useDeleteCampaignMutation,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  type Campaign,
} from '@/app/lib/data-access/configs/campaigns.config';
// Format date helper
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'Never';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return 'Invalid';
  }
};

function CampaignsManagementPageContent() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [editingCampaign, setEditingCampaign] = React.useState<Campaign | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const {
    data: campaigns = [],
    isLoading,
    isError,
    error,
  } = useGetAllCampaignsQuery();

  const [deleteCampaign, { isLoading: isDeleting }] = useDeleteCampaignMutation();
  const [createCampaign, { isLoading: isCreating }] = useCreateCampaignMutation();
  const [updateCampaign, { isLoading: isUpdating }] = useUpdateCampaignMutation();

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteCampaign(deleteId).unwrap();
        setDeleteId(null);
      } catch (error) {
        console.error('Failed to delete campaign:', error);
      }
    }
  };

  const handleCopyLink = (token: string) => {
    const url = `${window.location.origin}?campaign=${token}`;
    navigator.clipboard.writeText(url);
    // You could add a toast notification here
  };

  const handleSubmit = async (formData: any) => {
    try {
      if (editingCampaign) {
        await updateCampaign({
          id: editingCampaign._id,
          campaign: formData,
        }).unwrap();
        setEditingCampaign(null);
      } else {
        await createCampaign(formData).unwrap();
        setIsCreateModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to save campaign:', error);
    }
  };

  const columns: ColumnDef<Campaign>[] = [
    {
      id: 'select',
      enableHiding: false,
      cell: () => null,
    },
    {
      accessorKey: 'token',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Token
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
            {row.getValue('token')}
          </code>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => handleCopyLink(row.getValue('token'))}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => {
        const isActive = row.getValue('isActive') as boolean;
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? (
              <>
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Active
              </>
            ) : (
              <>
                <XCircle className="mr-1 h-3 w-3" />
                Inactive
              </>
            )}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'clickCount',
      header: 'Clicks',
      cell: ({ row }) => (
        <div className="text-center">{row.getValue('clickCount') || 0}</div>
      ),
    },
    {
      accessorKey: 'bonusAccessCount',
      header: 'Bonus Accesses',
      cell: ({ row }) => (
        <div className="text-center">{row.getValue('bonusAccessCount') || 0}</div>
      ),
    },
    {
      accessorKey: 'expiresAt',
      header: 'Expires',
      cell: ({ row }) => {
        const expiresAt = row.getValue('expiresAt') as string | undefined;
        if (!expiresAt) return <span className="text-muted-foreground">Never</span>;
        const date = new Date(expiresAt);
        const isExpired = date < new Date();
        return (
          <span className={isExpired ? 'text-red-500' : ''}>
            {formatDate(expiresAt)}
          </span>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const campaign = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleCopyLink(campaign.token)}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => window.open(`?campaign=${campaign.token}`, '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Preview Link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setEditingCampaign(campaign)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteId(campaign._id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: campaigns,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  if (isError) {
    return (
      <div className="p-6">
        <div className="text-red-500">Error loading campaigns: {String(error)}</div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Campaign Management</h1>
            <p className="text-muted-foreground">
              Create and manage campaigns to give users access to bonuses
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </div>

        <div className="mb-4">
          <Input
            placeholder="Filter campaigns by name or token..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>

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
                  <TableCell colSpan={columns.length} className="text-center">
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
                  <TableCell colSpan={columns.length} className="text-center">
                    No campaigns found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} campaign(s) total
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <CampaignFormDialog
        open={isCreateModalOpen || editingCampaign !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateModalOpen(false);
            setEditingCampaign(null);
          }
        }}
        onSubmit={handleSubmit}
        initialData={editingCampaign ?? undefined}
        isLoading={isCreating || isUpdating}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the campaign and
              users with this campaign token will lose access to bonuses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function CampaignsManagementPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <p>Loading campaigns...</p>
      </div>
    }>
      <CampaignsManagementPageContent />
    </Suspense>
  );
}

function CampaignFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  initialData?: Campaign;
  isLoading: boolean;
}) {
  const [formData, setFormData] = React.useState({
    token: initialData?.token || '',
    name: initialData?.name || '',
    description: initialData?.description || '',
    isActive: initialData?.isActive ?? true,
    expiresAt: initialData?.expiresAt
      ? new Date(initialData.expiresAt).toISOString().split('T')[0]
      : '',
    startsAt: initialData?.startsAt
      ? new Date(initialData.startsAt).toISOString().split('T')[0]
      : '',
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        token: initialData.token,
        name: initialData.name,
        description: initialData.description || '',
        isActive: initialData.isActive ?? true,
        expiresAt: initialData.expiresAt
          ? new Date(initialData.expiresAt).toISOString().split('T')[0]
          : '',
        startsAt: initialData.startsAt
          ? new Date(initialData.startsAt).toISOString().split('T')[0]
          : '',
      });
    } else {
      setFormData({
        token: '',
        name: '',
        description: '',
        isActive: true,
        expiresAt: '',
        startsAt: '',
      });
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData: any = {
      ...formData,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : undefined,
      startsAt: formData.startsAt ? new Date(formData.startsAt).toISOString() : undefined,
    };
    if (initialData) {
      // Remove token from update (it shouldn't be changed)
      delete submitData.token;
    }
    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Campaign' : 'Create Campaign'}</DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update the campaign details below.'
              : 'Create a new campaign. Users with the campaign token will have access to bonuses.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!initialData && (
            <div className="space-y-2">
              <Label htmlFor="token">Token *</Label>
              <Input
                id="token"
                value={formData.token}
                onChange={(e) =>
                  setFormData({ ...formData, token: e.target.value.toLowerCase().replace(/\s+/g, '-') })
                }
                placeholder="summer2024"
                required
                pattern="[a-z0-9-]+"
                title="Only lowercase letters, numbers, and hyphens"
              />
              <p className="text-xs text-muted-foreground">
                Use lowercase letters, numbers, and hyphens only. This will be used in the URL.
              </p>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Summer Bonus Campaign"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startsAt">Start Date</Label>
              <Input
                id="startsAt"
                type="date"
                value={formData.startsAt}
                onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expiration Date</Label>
              <Input
                id="expiresAt"
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              Active
            </Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : initialData ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

