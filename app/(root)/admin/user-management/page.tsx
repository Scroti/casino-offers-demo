'use client';

import * as React from 'react';
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
  ChevronDown,
  MoreHorizontal,
  Download,
  UserPlus,
  Mail,
  Shield,
  Ban,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useChangeUserStatusMutation,
  useChangeUserRoleMutation,
  useSendEmailToUserMutation,
  useBulkDeleteUsersMutation,
  useBulkChangeStatusMutation,
  useDebugUserQuery,
  type User,
} from '@/app/lib/data-access/configs/users.config';

export default function UserManagementTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // RTK Query hooks
  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useGetAllUsersQuery();

  const [deleteUser] = useDeleteUserMutation();
  const [changeUserStatus] = useChangeUserStatusMutation();
  const [changeUserRole] = useChangeUserRoleMutation();
  const [sendEmailToUser] = useSendEmailToUserMutation();
  const [bulkDeleteUsers] = useBulkDeleteUsersMutation();
  const [bulkChangeStatus] = useBulkChangeStatusMutation();

  // Debug query to help troubleshoot authentication
  const { data: debugData, error: debugError } = useDebugUserQuery();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'banned':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'moderator':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (userId: string, newStatus: User['status']) => {
    if (!confirm(`Are you sure you want to change this user's status to ${newStatus}?`)) {
      return;
    }

    try {
      await changeUserStatus({ id: userId, status: { status: newStatus } }).unwrap();
      alert(`User status changed to ${newStatus} successfully`);
    } catch (error) {
      console.error('Failed to change user status:', error);
      alert('Failed to change user status');
    }
  };

  const handleRoleChange = async (userId: string, newRole: User['role']) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }

    try {
      await changeUserRole({ id: userId, role: { role: newRole } }).unwrap();
      alert(`User role changed to ${newRole} successfully`);
    } catch (error) {
      console.error('Failed to change user role:', error);
      alert('Failed to change user role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteUser(userId).unwrap();
      alert('User deleted successfully');
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user');
    }
  };

  const handleSendEmail = async (userId: string) => {
    const subject = prompt('Enter email subject:');
    const message = prompt('Enter email message:');
    
    if (!subject || !message) {
      return;
    }

    try {
      await sendEmailToUser({ id: userId, subject, message }).unwrap();
      alert('Email sent successfully');
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email');
    }
  };

  // CSV Export Function
  const exportToCSV = () => {
    const filteredRows = table.getFilteredRowModel().rows;
    const headers = ['Name', 'Email', 'Role', 'Status', 'Created At', 'Last Login', 'Verified'];
    const csvContent = [
      headers.join(','),
      ...filteredRows.map((row) => {
        const user = row.original;
        return [
          `"${user.name}"`,
          `"${user.email}"`,
          `"${user.role}"`,
          `"${user.status}"`,
          `"${new Date(user.createdAt).toLocaleDateString()}"`,
          `"${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}"`,
          `"${user.isVerified ? 'Yes' : 'No'}"`,
        ].join(',');
      }),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `users-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: ColumnDef<User>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          User
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Role
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => {
        const role = row.getValue('role') as string;
        return (
          <Badge className={getRoleColor(role)}>
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge className={getStatusColor(status)}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'isVerified',
      header: 'Verified',
      cell: ({ row }) => {
        const isVerified = row.getValue('isVerified') as boolean;
        return (
          <div className="flex items-center">
            {isVerified ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue('createdAt') as string;
        return new Date(date).toLocaleDateString();
      },
    },
    {
      accessorKey: 'lastLogin',
      header: 'Last Login',
      cell: ({ row }) => {
        const date = row.getValue('lastLogin') as string;
        return date ? new Date(date).toLocaleDateString() : 'Never';
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Status Actions */}
              <DropdownMenuItem
                onClick={() => handleStatusChange(user._id, 'active')}
                disabled={user.status === 'active'}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Activate
              </DropdownMenuItem>
              
              <DropdownMenuItem
                onClick={() => handleStatusChange(user._id, 'inactive')}
                disabled={user.status === 'inactive'}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Deactivate
              </DropdownMenuItem>
              
              <DropdownMenuItem
                onClick={() => handleStatusChange(user._id, 'banned')}
                disabled={user.status === 'banned'}
                className="text-red-600"
              >
                <Ban className="mr-2 h-4 w-4" />
                Ban User
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {/* Role Actions */}
              <DropdownMenuItem
                onClick={() => handleRoleChange(user._id, 'moderator')}
                disabled={user.role === 'moderator'}
              >
                <Shield className="mr-2 h-4 w-4" />
                Make Moderator
              </DropdownMenuItem>
              
              <DropdownMenuItem
                onClick={() => handleRoleChange(user._id, 'user')}
                disabled={user.role === 'user'}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Make Regular User
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {/* Other Actions */}
              <DropdownMenuItem
                onClick={() => handleSendEmail(user._id)}
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </DropdownMenuItem>
              
              <DropdownMenuItem
                onClick={() => handleDeleteUser(user._id)}
                className="text-red-600"
              >
                <Ban className="mr-2 h-4 w-4" />
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading users...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-600">
          Error loading users: {error?.toString()}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-4">
        User Management
      </h1>

      

      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filter users..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <Button variant="outline" onClick={exportToCSV} className="ml-auto">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
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
    </div>
  );
}
