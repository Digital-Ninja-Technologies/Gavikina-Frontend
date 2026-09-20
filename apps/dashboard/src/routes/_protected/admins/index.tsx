/** biome-ignore-all lint/suspicious/noArrayIndexKey: <static skeleton> */
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Input } from "@workspace/ui/components/input"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { toast } from "@workspace/ui/components/toast"
import { cn } from "@workspace/ui/lib/utils"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  KeyRound,
  MoreVertical,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react"
import { useCallback, useMemo } from "react"
import { z } from "zod"
import { AsyncBoundary } from "#/components/async-boundary"
import { useConfirm } from "#/components/confirm-provider"
import type { AdminUser } from "@/modules/admins/api"
import { deleteAdmin } from "@/modules/admins/api"
import {
  adminsKeys,
  adminsListQueryOptions,
} from "@/modules/admins/query-options"
import { sessionQueryOptions } from "@/modules/auth/query-options"
import { openDialog } from "@/store/dialog-store"

// -----------------------------------------------------------------------------
// TABLE CONFIGURATION & FEATURES
// -----------------------------------------------------------------------------

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
})

type AdminTableFeatures = typeof features

// -----------------------------------------------------------------------------
// SEARCH VALIDATION SCHEMA
// -----------------------------------------------------------------------------

const adminsSearchSchema = z.object({
  page: z.number().default(1).catch(1),
  limit: z.number().default(10).catch(10),
  search: z.string().optional(),
})

export type AdminsSearch = z.infer<typeof adminsSearchSchema>

export const Route = createFileRoute("/_protected/admins/")({
  staticData: {
    title: "Admin Management",
  },
  validateSearch: adminsSearchSchema,
  beforeLoad: ({ context }) => {
    void context.queryClient.query(adminsListQueryOptions())
  },
  component: AdminsRoute,
})

function AdminsRoute() {
  const searchParams = Route.useSearch()

  return (
    <div className="flex animate-gv-fade flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Platform Admins</h1>
          <p className="page-description mt-1">
            Manage administrator access credentials and security settings for
            the portal.
          </p>
        </div>

        <Button onClick={() => openDialog("ADMIN_FORM")}>
          <Plus /> Add Admin
        </Button>
      </div>

      <AsyncBoundary
        errorTitle="Failed to Load Admin Users"
        fallback={<AdminsTableSkeleton />}
      >
        <AdminsContent searchParams={searchParams} />
      </AsyncBoundary>
    </div>
  )
}

function AdminsContent({ searchParams }: { searchParams: AdminsSearch }) {
  const navigate = useNavigate({ from: "/admins/" })
  const confirm = useConfirm()
  const queryClient = useQueryClient()

  const { data: admins } = useSuspenseQuery(adminsListQueryOptions())
  const { data: session } = useSuspenseQuery(sessionQueryOptions())

  const currentUserId = session?.user?.id

  const deleteMutation = useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => {
      toast.add({
        title: "Admin Removed",
        description: "The administrator has been removed successfully.",
        type: "success",
      })
      queryClient.invalidateQueries({ queryKey: adminsKeys.all })
    },
    onError: (error) => {
      toast.add({
        title: "Failed to Remove Admin",
        description:
          error instanceof Error
            ? error.message
            : "There was a problem deleting this administrator.",
        type: "error",
      })
    },
  })

  const handleDelete = useCallback(
    async (admin: AdminUser) => {
      const isConfirmed = await confirm({
        title: `Remove ${admin.name}?`,
        description:
          "This account will immediately lose access to the Gavikina management portal.",
        confirmText: "Remove Account",
        variant: "destructive",
      })

      if (isConfirmed) {
        deleteMutation.mutate(admin.id)
      }
    },
    [confirm, deleteMutation]
  )

  const handleResetPassword = useCallback((admin: AdminUser) => {
    openDialog("RESET_ADMIN_PASSWORD", {
      adminId: admin.id,
      adminEmail: admin.email,
      adminName: admin.name,
    })
  }, [])

  const columns = useMemo<ColumnDef<AdminTableFeatures, AdminUser>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Admin",
        cell: ({ row }) => {
          const admin = row.original
          const isSelf = admin.id === currentUserId
          const initials = admin.name
            .split(" ")
            .map((part) => part[0])
            .filter(Boolean)
            .slice(0, 2)
            .join("")
            .toUpperCase()

          return (
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-navy/10 bg-navy/5 text-xs font-semibold text-navy">
                {initials || "AD"}
              </div>
              <div className="flex min-w-0 flex-col">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold text-navy">
                    {admin.name}
                  </span>
                  {isSelf && (
                    <Badge
                      variant="secondary"
                      className="bg-navy/5 px-1.5 py-0 text-[10px] font-normal text-navy/60"
                    >
                      You
                    </Badge>
                  )}
                </div>
                <span className="truncate text-xs text-navy/60">
                  {admin.email}
                </span>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
          const admin = row.original
          return admin.isSuperAdmin ? (
            <Badge
              variant="outline"
              className="gap-1 border-green/30 bg-green/10 text-xs font-semibold text-green"
            >
              <ShieldCheck className="size-3" />
              Super Admin
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="gap-1 border-navy/20 bg-navy/5 text-xs text-navy/70"
            >
              <UserCheck className="size-3" />
              Admin
            </Badge>
          )
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => {
          const sorted = column.getIsSorted()
          return (
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-navy/60 uppercase hover:text-navy"
              onClick={() => column.toggleSorting(sorted === "asc")}
            >
              Created Date
              {sorted === "asc" ? (
                <ArrowUp className="size-3.5" />
              ) : sorted === "desc" ? (
                <ArrowDown className="size-3.5" />
              ) : (
                <ArrowUpDown className="size-3.5 opacity-50" />
              )}
            </button>
          )
        },
        cell: ({ getValue }) => {
          const val = getValue<string>()
          return (
            <span className="text-xs text-navy/70 tabular-nums">
              {val
                ? new Date(val).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Unknown"}
            </span>
          )
        },
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const admin = row.original
          const isSelf = admin.id === currentUserId

          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-navy/50 hover:text-navy"
                    />
                  }
                >
                  <MoreVertical className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => handleResetPassword(admin)}
                    className="cursor-pointer"
                  >
                    <KeyRound className="mr-2 size-3.5 text-navy/70" />
                    Reset Password
                  </DropdownMenuItem>

                  {!admin.isSuperAdmin && !isSelf && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(admin)}
                        disabled={deleteMutation.isPending}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 size-3.5" />
                        Remove Admin
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
      },
    ],
    [currentUserId, deleteMutation.isPending, handleDelete, handleResetPassword]
  )

  const filteredAdmins = useMemo(() => {
    if (!searchParams.search?.trim()) return admins
    const query = searchParams.search.toLowerCase()
    return admins.filter(
      (admin) =>
        admin.name.toLowerCase().includes(query) ||
        admin.email.toLowerCase().includes(query)
    )
  }, [admins, searchParams.search])

  const superAdminCount = useMemo(
    () => admins.filter((a) => a.isSuperAdmin).length,
    [admins]
  )

  const totalCount = filteredAdmins.length
  const totalPages = Math.ceil(totalCount / searchParams.limit) || 1

  const table = useTable({
    features,
    data: filteredAdmins,
    columns,
    state: {
      pagination: {
        pageIndex: searchParams.page - 1,
        pageSize: searchParams.limit,
      },
    },
  })

  const handleSearchChange = (value: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        page: 1,
        search: value ? value : undefined,
      }),
      replace: true,
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Metric Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-navy/10 bg-white p-0 shadow-xs">
          <CardContent className="p-5">
            <span className="text-xs font-semibold tracking-wider text-navy/50 uppercase">
              Total Admins
            </span>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-2xl font-semibold tracking-tight text-navy">
                {admins.length}
              </span>
              <Users className="size-5 text-navy/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="p-0 shadow-xs">
          <CardContent className="p-5">
            <span className="text-xs font-semibold tracking-wider text-navy/50 uppercase">
              Super Admins
            </span>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-2xl font-semibold tracking-tight text-green">
                {superAdminCount}
              </span>
              <ShieldCheck className="size-5 text-green/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="p-0 shadow-xs">
          <CardContent className="p-5">
            <span className="text-xs font-semibold tracking-wider text-navy/50 uppercase">
              Standard Admins
            </span>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-2xl font-semibold tracking-tight text-navy">
                {admins.length - superAdminCount}
              </span>
              <UserCheck className="size-5 text-navy/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search  */}
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-navy/40" />
        <Input
          value={searchParams.search || ""}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by name or email..."
          className="h-10.5 bg-white pl-9"
        />
      </div>

      {/* Table Card */}
      <Card className="gap-0 overflow-hidden border-navy/10 py-0 shadow-xs">
        <Table>
          <TableHeader className="bg-muted/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "text-xs font-semibold tracking-wider text-navy/60 uppercase",
                      header.id === "actions" && "text-right"
                    )}
                  >
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="transition-colors hover:bg-cream/40"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3.5">
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className="h-28 text-center text-sm text-navy/50"
                >
                  No platform administrators found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Table Pagination */}
        <div className="flex items-center justify-between border-t border-navy/10 bg-white/50 px-4 py-3">
          <p className="text-xs text-navy/50">
            Showing{" "}
            <span className="font-semibold text-navy">
              {totalCount === 0
                ? 0
                : (searchParams.page - 1) * searchParams.limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-navy">
              {Math.min(searchParams.page * searchParams.limit, totalCount)}
            </span>{" "}
            of <span className="font-semibold text-navy">{totalCount}</span>{" "}
            records
          </p>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                navigate({
                  search: (p) => ({ ...p, page: p.page - 1 }),
                })
              }
              disabled={searchParams.page <= 1}
              className="h-8"
            >
              <ChevronLeft className="mr-1 size-3.5" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                navigate({
                  search: (p) => ({ ...p, page: p.page + 1 }),
                })
              }
              disabled={searchParams.page >= totalPages}
              className="h-8"
            >
              Next <ChevronRight className="ml-1 size-3.5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

// -----------------------------------------------------------------------------
// SKELETON LOADER
// -----------------------------------------------------------------------------

export function AdminsTableSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="border-navy/10 p-5 shadow-xs">
            <Skeleton className="h-4 w-24 bg-navy/10" />
            <Skeleton className="mt-2 h-7 w-12 bg-navy/10" />
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden border-navy/10 py-0 shadow-xs">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              {["Admin", "Role", "Created Date", ""].map((header, idx) => (
                <TableHead key={idx} className="py-3">
                  <Skeleton className="h-4 w-20 bg-navy/10" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="py-3.5">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-9 rounded-full bg-navy/10" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-32 bg-navy/10" />
                      <Skeleton className="h-3 w-48 bg-navy/5" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3.5">
                  <Skeleton className="h-6 w-24 rounded-full bg-navy/10" />
                </TableCell>
                <TableCell className="py-3.5">
                  <Skeleton className="h-4 w-24 bg-navy/5" />
                </TableCell>
                <TableCell className="py-3.5 text-right">
                  <Skeleton className="ml-auto size-8 rounded-md bg-navy/5" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between border-t border-navy/10 bg-white/50 px-4 py-3">
          <Skeleton className="h-4 w-48 bg-navy/5" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-16 bg-navy/10" />
            <Skeleton className="h-8 w-16 bg-navy/10" />
          </div>
        </div>
      </Card>
    </div>
  )
}
