"use client";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import {
  ADMIN_COUPON_ADD,
  ADMIN_COUPON_EDIT,
  ADMIN_COUPON_SHOW,
  ADMIN_DASHBOARD,
  ADMIN_ORDERS_DETAILS,
  ADMIN_TRASH,
} from "@/routes/AdminPanelRoute";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { FiPlus } from "react-icons/fi";
import Link from "next/link";

import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import { useCallback, useMemo } from "react";
import { columnConfig } from "@/lib/helper";

import EditAction from "@/components/Application/Admin/EditAction";
import DeleteAction from "@/components/Application/Admin/DeleteAction";
import { DT_COUPON_COLUMN, DT_ORDER_COLUMN } from "@/lib/column";
import ViewAction from "@/components/Application/Admin/ViewAction";

/* --------------------------------------------------------------------
   Types
-------------------------------------------------------------------- */
export interface OrderRow {
    _id: string;
  order_id: string;
  code: string;
  minShoppingAmount: number;
  discountPercentage: number;
  validity: string; // ISO string date
}

/* Action Props */
interface ActionCallbackProps {
  row: { original: OrderRow };
  deleteType: "SD" | "PD" | "RSD";
  handleDelete: (row: any, deleteType: "SD" | "PD" | "RSD",) => void;
}

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: '', label: "Orders" },
];

export default function ShowOrder() {
  /* ---------------------------------------
      Typed columns
  ---------------------------------------- */
  const columns = useMemo(() => {
    return columnConfig(DT_ORDER_COLUMN);
  }, []);

  /* ---------------------------------------
      Typed action menu
  ---------------------------------------- */
  const action = useCallback(
    (
      row: ActionCallbackProps["row"],
      deleteType: "SD" | "PD" | "RSD",
      handleDelete: ActionCallbackProps["handleDelete"]
    ) => {
      return [
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
      ];
    },
    []
  );

  /* ---------------------------------------
      Page Render
  ---------------------------------------- */
  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0 gap-0">
        <CardHeader className="pt-2 px-3 border-b [.border-b]:pb-2">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold">Show Orders</h4>

            {/* <Button>
              <FiPlus />
              <Link href={ADMIN_COUPON_ADD}>New Coupon</Link>
            </Button> */}
          </div>
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
}
