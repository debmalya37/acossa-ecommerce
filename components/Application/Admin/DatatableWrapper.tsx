/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { ThemeProvider } from "@mui/material"
import Datatable from "./Datatable"
import { useTheme } from "next-themes"
import { JSX, useEffect, useState } from "react"
import { darkTheme, lightTheme } from "@/lib/materialTheme"

/* -----------------------------
   MAKE PROPS GENERIC <T>
------------------------------ */
interface DatatableWrapperProps<T> {
  queryKey: string;
  fetchUrl: string;
  columnsConfig: any[];
  initialPageSize?: number;
  exportEndpoint?: string;
  deleteEndpoint?: string;
  deleteType?: "SD" | "PD";
  trashView?: string;

  createAction?: (
    row: { original: T },
    deleteType: "SD" | "PD" | "RSD",
    handleDelete: (ids: string[], deleteType: "SD" | "PD" | "RSD") => void
  ) => JSX.Element | JSX.Element[];
}

/* -----------------------------
   MAKE COMPONENT GENERIC <T>
------------------------------ */
function DatatableWrapper<T extends Record<string, any>>({
  queryKey,
  fetchUrl,
  columnsConfig,
  initialPageSize = 10,
  exportEndpoint,
  deleteEndpoint,
  deleteType,
  trashView,
  createAction
}: DatatableWrapperProps<T>) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <ThemeProvider theme={resolvedTheme === 'dark' ? darkTheme : lightTheme}>
      <Datatable
        queryKey={queryKey}
        fetchUrl={fetchUrl}
        columnsConfig={columnsConfig}
        initialPageSize={initialPageSize}
        exportEndpoint={exportEndpoint}
        deleteEndpoint={deleteEndpoint}
        deleteType={deleteType}
        trashView={trashView}
        createAction={createAction}
      />
    </ThemeProvider>
  )
}

export default DatatableWrapper
