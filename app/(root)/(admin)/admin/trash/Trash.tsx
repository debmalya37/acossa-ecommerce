/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import DeleteAction from "@/components/Application/Admin/DeleteAction";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { columnConfig } from "@/lib/helper";

import {
  DT_CATEGORY_COLUMN,
  DT_COUPON_COLUMN,
  DT_CUSTOMERS_COLUMN,
  DT_PRODUCT_COLUMN,
  DT_PRODUCT_VARIANT_COLUMN,
  DT_REVIEWS_COLUMN,
} from "@/lib/column";

import {
  ADMIN_DASHBOARD,
  ADMIN_TRASH,
} from "@/routes/AdminPanelRoute";

/* ------------------------------------------------------------------
   Types
------------------------------------------------------------------ */
type TrashKeys =
  | "category"
  | "product"
  | "productvariant"
  | "coupon"
  | "customers"
  | "review";

interface TrashConfig {
  title: string;
  columns: any[];
  fetchUrl: string;
  exportUrl: string;
  deleteUrl: string;
}

/* ------------------------------------------------------------------
   Config Map
------------------------------------------------------------------ */
const TRASH_CONFIG: Record<TrashKeys, TrashConfig> = {
  category: {
    title: "Category Trash",
    columns: DT_CATEGORY_COLUMN,
    fetchUrl: "/api/category",
    exportUrl: "/api/category/export",
    deleteUrl: "/api/category/delete",
  },

  product: {
    title: "Product Trash",
    columns: DT_PRODUCT_COLUMN,
    fetchUrl: "/api/product",
    exportUrl: "/api/product/export",
    deleteUrl: "/api/product/delete",
  },

  productvariant: {
    title: "Product Variant Trash",
    columns: DT_PRODUCT_VARIANT_COLUMN,
    fetchUrl: "/api/productvariant",
    exportUrl: "/api/productvariant/export",
    deleteUrl: "/api/productvariant/delete",
  },

  coupon: {
    title: "Coupon Trash",
    columns: DT_COUPON_COLUMN,
    fetchUrl: "/api/coupon",
    exportUrl: "/api/coupon/export",
    deleteUrl: "/api/coupon/delete",
  },

  customers: {
    title: "Customers Trash",
    columns: DT_CUSTOMERS_COLUMN,
    fetchUrl: "/api/customers",
    exportUrl: "/api/customers/export",
    deleteUrl: "/api/customers/delete",
  },

  review: {
    title: "Review Trash",
    columns: DT_REVIEWS_COLUMN,
    fetchUrl: "/api/review",
    exportUrl: "/api/review/export",
    deleteUrl: "/api/review/delete",
  },
};

/* ------------------------------------------------------------------
   Breadcrumb
------------------------------------------------------------------ */
const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_TRASH, label: "Trash" },
];

/* ------------------------------------------------------------------
   Page Component
------------------------------------------------------------------ */
export default function TrashPage() {
  const searchParams = useSearchParams();
  const trashOf = searchParams.get("trashof") as TrashKeys | null;

  // Guard against invalid or missing trashOf param
  const config: TrashConfig | null = trashOf ? TRASH_CONFIG[trashOf] : null;

  const columns = useMemo(() => {
    if (!config) return [];
    return columnConfig(config.columns, false, false, true);
  }, [config]);

  const renderAction = useCallback(
    (row: any, deleteType: "SD" | "PD" | "RSD", handleDelete: any) => {
      return [
        <DeleteAction
          key="delete"
          handleDelete={handleDelete}
          row={row}
          deleteType={deleteType}
        />,
      ];
    },
    []
  );

  if (!config) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Invalid Trash Type</h2>
        <p className="text-sm text-muted-foreground">
          Please use a valid &quot;trashof&quot; query parameter.
        </p>
      </div>
    );
  }

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0 gap-0">
        <CardHeader className="pt-2 px-3 border-b [.border-b]:pb-2">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold">{config.title}</h4>
          </div>
        </CardHeader>

        <CardContent className="px-0">
          <DatatableWrapper
            queryKey={`${trashOf}-data-deleted`}
            fetchUrl={config.fetchUrl}
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint={config.exportUrl}
            deleteEndpoint={config.deleteUrl}
            deleteType="PD"
            createAction={renderAction}
          />
        </CardContent>
      </Card>
    </div>
  );
}
