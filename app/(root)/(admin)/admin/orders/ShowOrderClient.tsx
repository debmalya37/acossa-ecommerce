"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import {
  ADMIN_DASHBOARD,
  ADMIN_ORDERS_DETAILS,
  ADMIN_TRASH,
} from "@/routes/AdminPanelRoute";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import { useCallback, useMemo } from "react";
import { columnConfig } from "@/lib/helper";
import { DT_ORDER_COLUMN } from "@/lib/column";
import ViewAction from "@/components/Application/Admin/ViewAction";
import DeleteAction from "@/components/Application/Admin/DeleteAction";

export interface OrderRow {
  _id: string;
  order_id: string;
  code: string;
  minShoppingAmount: number;
  discountPercentage: number;
  validity: string;
}

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: "", label: "Orders" },
];

const ShowOrderClient = () => {
  const columns = useMemo(() => columnConfig(DT_ORDER_COLUMN), []);

  const action = useCallback(
    (row: any, deleteType: "SD" | "PD" | "RSD", handleDelete: any) => [
      <ViewAction
        key="view"
        href={ADMIN_ORDERS_DETAILS(row.original.order_id)}
      />,
      <DeleteAction
        key="delete"
        row={{ original: { _id: row.original._id } }}
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
          <h4 className="text-xl font-semibold">Show Orders</h4>
        </CardHeader>

        <CardContent className="px-0">
          <DatatableWrapper
            queryKey="orders-data"
            fetchUrl="/api/orders"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/orders/export"
            deleteEndpoint="/api/orders/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=orders`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowOrderClient;
