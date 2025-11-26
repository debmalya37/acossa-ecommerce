/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { IconButton, Tooltip } from "@mui/material"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import type { JSX, ReactNode } from "react";


import {
  MaterialReactTable,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  useMaterialReactTable
} from "material-react-table"
import Link from "next/link"
import { useState } from "react"
import RecyclingIcon from "@mui/icons-material/Recycling"
import DeleteIcon from "@mui/icons-material/Delete"
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import useDeleteMutation from "@/hooks/useDeleteMutation"
import ButtonLoading from "../LoadingButton"
import SaveAltIcon from "@mui/icons-material/SaveAlt"
import { showToast } from "@/lib/showToast"
import { download, generateCsv, mkConfig } from "export-to-csv"
import axios from "axios"
import { TooltipContent } from "@/components/ui/tooltip"

interface DatatableProps {
  queryKey: string;
  fetchUrl: string;
  columnsConfig: any[]; // or your column type
  initialPageSize?: number;
  exportEndpoint?: string;
  deleteEndpoint?: string;
  // restrict allowed delete types
  deleteType?: "SD" | "PD";
  // URL for trash view (optional)
  trashView?: string;
  // createAction returns menu items for a row
  createAction?: (
    row: any,
    deleteType: "SD" | "PD" | "RSD",
    handleDelete: (ids: string[], deleteType: "SD" | "PD" | "RSD") => void
  ) => JSX.Element | JSX.Element[];
}

const Datatable: React.FC<DatatableProps> = ({
  queryKey,
  fetchUrl,
  columnsConfig,
  initialPageSize = 10,
  exportEndpoint,
  deleteEndpoint,
  deleteType = 'SD',
  trashView,
  createAction
}: DatatableProps) => {
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [sorting, setSorting] = useState<any[]>([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize
  })
  // row selection state
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})

  // Export loading state
  const [exportLoading, setExportLoading] = useState(false)

  // handle delete method
  // note: pass empty string if deleteEndpoint not provided to keep useDeleteMutation typed
const deleteMutation = useDeleteMutation(queryKey, deleteEndpoint ?? "");

const handleDelete = (ids: string[], deleteTypeLocal: "SD" | "PD" | "RSD") => {
  const confirmMessage =
    deleteTypeLocal === "PD"
      ? "Are you sure you want to delete the data permanently?"
      : "Are you sure you want to move data into trash?";

  if (!confirm(confirmMessage)) return;

  deleteMutation.mutate({ ids, deleteType: deleteTypeLocal });
  setRowSelection({});
};


  // export method
  const handleExport = async (selectedRows: any[]) => {
    setExportLoading(true)
    try {
      const csvConfig = mkConfig({
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
        filename: 'csv-data'
      })
      let csv
      if (Object.keys(rowSelection).length > 0) {
        const rowData = selectedRows.map((row) => row.original)
        csv = generateCsv(csvConfig)(rowData)
      } else {
        // export all data
        if (!exportEndpoint) throw new Error('Export endpoint not provided')
        const { data: response } = await axios.get(exportEndpoint)
        if (!response.success) {
          throw new Error(response.message)
        }
        const rowData = response.data
        csv = generateCsv(csvConfig)(rowData)
      }
      download(csvConfig)(csv)
    } catch (error: any) {
      console.log(error)
      showToast('error', error.message || 'Export failed')
    } finally {
      setExportLoading(false)
    }
  }

  // data fetching logic
  const {
    data: queryResponse = { data: [], meta: undefined },
    isError,
    isRefetching,
    isLoading
  } = useQuery({
    queryKey: [queryKey, { columnFilters, globalFilter, pagination, sorting }],
    queryFn: async () => {
      const url = new URL(fetchUrl, process.env.NEXT_PUBLIC_BASE_URL)
      url.searchParams.set('start', `${pagination.pageIndex * pagination.pageSize}`)
      url.searchParams.set('size', `${pagination.pageSize}`)
      url.searchParams.set('filters', JSON.stringify(columnFilters ?? []))
      url.searchParams.set('globalFilter', globalFilter ?? '')
      url.searchParams.set('sorting', JSON.stringify(sorting ?? []))
      url.searchParams.set('deleteType', deleteType ?? '')
      const { data: response } = await axios.get(url.href)
      return response
    },
    placeholderData: keepPreviousData
  })

  const data: any[] = queryResponse?.data ?? []
  const meta = queryResponse?.meta

  // init table
  interface TableState {
    columnFilters: any[];
    globalFilter: string;
    isLoading: boolean;
    pagination: {
      pageIndex: number;
      pageSize: number;
    };
    showAlertBanner: boolean;
    showProgressBars: boolean;
    sorting: any[];
    rowSelection: Record<string, boolean>;
  }

  const table = useMaterialReactTable({
    columns: columnsConfig,
    data,
    enableRowSelection: true,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    enableColumnOrdering: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    initialState: { showColumnFilters: true },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiToolbarAlertBannerChipProps: isError
      ? {
          color: "error",
          label: "Error loading data",
        }
      : undefined,

    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: meta?.totalRowCount ?? 0,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
      rowSelection,
    } as TableState,
    getRowId: (originalRow: any) => originalRow._id,
    renderToolbarInternalActions: ({ table }: any) => (
      <>
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />
        {deleteType !== 'PD' && trashView && (
          <Tooltip title="Recycle Bin">
            <Link href={trashView}>
              <IconButton>
                <RecyclingIcon />
              </IconButton>
            </Link>
          </Tooltip>
        )}
        {deleteType === 'SD' && (
          <Tooltip title="Delete All">
            <IconButton
              disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
              onClick={() => handleDelete(Object.keys(rowSelection), deleteType ?? 'SD')}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
        {deleteType === 'PD' && (
          <>
            <Tooltip title="Restore Data">
              <IconButton
                disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                onClick={() => handleDelete(Object.keys(rowSelection), 'RSD')}
              >
                <RestoreFromTrashIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Permanently Delete Data">
              <IconButton
                disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                onClick={() => handleDelete(Object.keys(rowSelection), deleteType ?? 'PD')}
              >
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </>
    ),
    enableRowActions: true,
    positionActionsColumn: 'last',
    renderRowActionMenuItems: (props) => {
  // props -> { closeMenu, row, staticRowIndex, table }
  if (!createAction) return undefined;

  const res = createAction(props.row, deleteType ?? "SD", handleDelete);
  if (!res) return undefined;
  return Array.isArray(res) ? (res as ReactNode[]) : [res as ReactNode];
},

    renderTopToolbarCustomActions: ({ table }: any) => (
      <TooltipContent>
        <ButtonLoading
          type={'button'}
          text="Export"           // must be string
      // icon prop optional — only if your ButtonLoading accepts it
      // icon={<SaveAltIcon />}
          loading={exportLoading}
          onClick={() => handleExport(table.getSelectedRowModel().rows)}
          className={'cursor-pointer'}
        />
      </TooltipContent>
    ),
  })

  return (
    <MaterialReactTable table={table} />
  )
}

export default Datatable
