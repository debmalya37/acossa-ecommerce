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
   ✔ Define Row Structure for Customer Table
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
   ✔ Props for action callback
----------------------------------------------------------- */
interface ActionProps {
  row: {
    original: CustomerRow;
  };
  deleteType: "SD" | "PD" | "RSD",
  handleDelete: (row: any, deleteType: "SD" | "PD" | "RSD") => void;
}

/* ----------------------------------------------------------
   ✔ Breadcrumb
----------------------------------------------------------- */
const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: "", label: "Customers" },
];

/* ----------------------------------------------------------
   ✔ Page Component
----------------------------------------------------------- */
export default function ShowCustomer() {
  /* --------------------------------------------------------
     Columns (Typed)
  --------------------------------------------------------- */
  const columns = useMemo(() => {
    return columnConfig(DT_CUSTOMERS_COLUMN);
  }, []);

  /* --------------------------------------------------------
     Row Action Menu (Typed)
  --------------------------------------------------------- */
  const action = useCallback(
    (row: ActionProps["row"], deleteType: "SD" | "PD" | "RSD", handleDelete: ActionProps["handleDelete"]) => {
      return [
        <DeleteAction
          key="delete"
          row={row}
          deleteType={deleteType}
          handleDelete={handleDelete}
        />,
      ];
    },
    []
  );

  /* --------------------------------------------------------
     Render
  --------------------------------------------------------- */
  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0 gap-0">
        <CardHeader className="pt-2 px-3 border-b [.border-b]:pb-2">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold">Customers</h4>
          </div>
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
}
