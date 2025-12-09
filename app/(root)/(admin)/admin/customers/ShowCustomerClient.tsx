/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import { ADMIN_DASHBOARD, ADMIN_TRASH } from "@/routes/AdminPanelRoute";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import { useCallback, useMemo } from "react";
import { columnConfig } from "@/lib/helper";

import DeleteAction from "@/components/Application/Admin/DeleteAction";
import { DT_CUSTOMERS_COLUMN } from "@/lib/column";

/* ----------------------------------------------------------
   Row Type
----------------------------------------------------------- */
export interface CustomerRow {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  isActive: boolean;
}

/* ----------------------------------------------------------
   Breadcrumb
----------------------------------------------------------- */
const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: "", label: "Customers" },
];

const ShowCustomerClient = () => {
  /* Columns */
  const columns = useMemo(() => columnConfig(DT_CUSTOMERS_COLUMN), []);

  /* Row actions */
  const action = useCallback(
    (
      row: { original: CustomerRow },
      deleteType: "SD" | "PD" | "RSD",
      handleDelete: (ids: string[], deleteType: "SD" | "PD" | "RSD") => void
    ) => [
      <DeleteAction
        key="delete"
        row={row}
        deleteType={deleteType}
        handleDelete={handleDelete}
      />,
    ],
    []
  );

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0 gap-0">
        <CardHeader className="pt-2 px-3 border-b">
          <h4 className="text-xl font-semibold">Customers</h4>
        </CardHeader>

        <CardContent className="px-0">
          <DatatableWrapper<CustomerRow>
            queryKey="customers-data"
            fetchUrl="/api/customers"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/customers/export"
            deleteEndpoint="/api/customers/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=customers`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowCustomerClient;
