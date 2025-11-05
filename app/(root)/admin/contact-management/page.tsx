"use client";

import * as React from "react";
import { Suspense } from "react";
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
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Mail,
  Eye,
  CheckCircle2,
  XCircle,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth.context";
import {
  useGetAllContactsQuery,
  useGetContactByIdQuery,
  useMarkAsReadMutation,
  useMarkAsResolvedMutation,
  type Contact,
} from "@/app/lib/data-access/configs/contact-management.config";

function ContactManagementPageContent() {
  const { user } = useAuth();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedContact, setSelectedContact] =
    React.useState<Contact | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [resolveDialogOpen, setResolveDialogOpen] = React.useState(false);
  const [resolveResponse, setResolveResponse] = React.useState("");

  const {
    data: contacts = [],
    isLoading,
    isError,
    error,
  } = useGetAllContactsQuery();

  const [markAsRead] = useMarkAsReadMutation();
  const [markAsResolved, { isLoading: isResolving }] =
    useMarkAsResolvedMutation();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "technical":
        return "bg-blue-100 text-blue-800";
      case "billing":
        return "bg-yellow-100 text-yellow-800";
      case "account":
        return "bg-purple-100 text-purple-800";
      case "feedback":
        return "bg-green-100 text-green-800";
      case "general":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleMarkAsRead = async (contactId: string) => {
    try {
      await markAsRead(contactId).unwrap();
    } catch (error) {
      console.error("Failed to mark as read:", error);
      alert("Failed to mark as read");
    }
  };

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setViewDialogOpen(true);
    if (!contact.isRead) {
      handleMarkAsRead(contact._id);
    }
  };

  const handleResolveContact = async () => {
    if (!selectedContact) return;
    try {
      await markAsResolved({
        id: selectedContact._id,
        response: resolveResponse || undefined,
      }).unwrap();
      setResolveDialogOpen(false);
      setResolveResponse("");
      setViewDialogOpen(false);
      setSelectedContact(null);
    } catch (error) {
      console.error("Failed to resolve contact:", error);
      alert("Failed to resolve contact");
    }
  };

  const columns: ColumnDef<Contact>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
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
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const contact = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="font-medium">{contact.name}</div>
              <div className="text-sm text-muted-foreground">
                {contact.email}
              </div>
            </div>
            {!contact.isRead && (
              <div className="h-2 w-2 rounded-full bg-primary" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "subject",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Subject
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const subject = row.getValue("subject") as string;
        return <div className="max-w-[300px] truncate">{subject}</div>;
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.getValue("category") as string;
        return (
          <Badge className={getCategoryColor(category)}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "isRead",
      header: "Status",
      cell: ({ row }) => {
        const isRead = row.getValue("isRead") as boolean;
        const isResolved = row.original.isResolved;
        return (
          <div className="flex items-center gap-2">
            {isResolved ? (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Resolved
              </Badge>
            ) : isRead ? (
              <Badge className="bg-blue-100 text-blue-800">Read</Badge>
            ) : (
              <Badge className="bg-orange-100 text-orange-800">New</Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string;
        return date
          ? new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-";
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const contact = row.original;

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
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleViewContact(contact)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              {!contact.isRead && (
                <DropdownMenuItem
                  onClick={() => handleMarkAsRead(contact._id)}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark as Read
                </DropdownMenuItem>
              )}
              {!contact.isResolved && (
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedContact(contact);
                    setResolveDialogOpen(true);
                  }}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark as Resolved
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: contacts,
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
        <p>Loading contacts...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-600">
          Error loading contacts: {error?.toString()}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Contact Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and respond to customer inquiries
          </p>
        </div>
      </div>

      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filter by name, email, or subject..."
          value={
            (table.getColumn("name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) => {
            const value = event.target.value;
            table.getColumn("name")?.setFilterValue(value);
            table.getColumn("subject")?.setFilterValue(value);
          }}
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
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

      <div className="rounded-md border">
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
                  data-state={row.getIsSelected() && "selected"}
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
                  No contacts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
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

      {/* View Contact Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Contact Details
            </DialogTitle>
            <DialogDescription>
              View and manage this contact submission
            </DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <p className="font-medium">{selectedContact.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedContact.email}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Category
                  </Label>
                  <Badge className={getCategoryColor(selectedContact.category)}>
                    {selectedContact.category.charAt(0).toUpperCase() +
                      selectedContact.category.slice(1)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Date</Label>
                  <p className="font-medium">
                    {selectedContact.createdAt
                      ? new Date(selectedContact.createdAt).toLocaleString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Subject</Label>
                <p className="font-medium">{selectedContact.subject}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Message</Label>
                <div className="mt-2 p-4 bg-muted rounded-md whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>
              {selectedContact.response && (
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Response
                  </Label>
                  <div className="mt-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-md whitespace-pre-wrap">
                    {selectedContact.response}
                  </div>
                  {selectedContact.respondedAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Responded on{" "}
                      {new Date(selectedContact.respondedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
              <div className="flex gap-2 pt-4">
                {!selectedContact.isResolved && (
                  <Button
                    onClick={() => {
                      setResolveDialogOpen(true);
                    }}
                    className="flex-1"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark as Resolved
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Resolve Contact Dialog */}
      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Contact</DialogTitle>
            <DialogDescription>
              Add an optional response message and mark this contact as resolved
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="response">Response (Optional)</Label>
              <Textarea
                id="response"
                value={resolveResponse}
                onChange={(e) => setResolveResponse(e.target.value)}
                placeholder="Add a response message..."
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setResolveDialogOpen(false);
                  setResolveResponse("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleResolveContact} disabled={isResolving}>
                {isResolving ? "Resolving..." : "Mark as Resolved"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ContactManagementPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <p>Loading contacts...</p>
      </div>
    }>
      <ContactManagementPageContent />
    </Suspense>
  );
}

