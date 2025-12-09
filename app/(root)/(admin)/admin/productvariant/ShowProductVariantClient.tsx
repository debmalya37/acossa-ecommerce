/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import {
  ADMIN_DASHBOARD,
  ADMIN_PRODUCT_VARIANT_ADD,
  ADMIN_PRODUCT_VARIANT_EDIT,
  ADMIN_PRODUCT_VARIANT_SHOW,
  ADMIN_TRASH,
} from "@/routes/AdminPanelRoute";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import Link from "next/link";

import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import { useCallback, useMemo } from "react";
import { columnConfig } from "@/lib/helper";
import { DT_PRODUCT_VARIANT_COLUMN } from "@/lib/column";
import EditAction from "@/components/Application/Admin/EditAction";
import DeleteAction from "@/components/Application/Admin/DeleteAction";

/* -------------------------------------------------
   Types
-------------------------------------------------- */
interface ProductVariantRow {
  _id: string;
  product: string;
  color: string;
  size: string;
  sku: string;
  mrp: number;
  sellingPrice: number;
  discountPercentage: number;
}

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_PRODUCT_VARIANT_SHOW, label: "Product Variant" },
];

const ShowProductVariantClient = () => {
  /* Columns */
  const columns = useMemo(
    () => columnConfig(DT_PRODUCT_VARIANT_COLUMN),
    []
  );

  /* Actions */
  const action = useCallback(
    (
      row: { original: ProductVariantRow },
      deleteType: "SD" | "PD" | "RSD",
      handleDelete: (ids: string[], deleteType: "SD" | "PD" | "RSD") => void
    ) => [
      <EditAction
        key="edit"
        href={ADMIN_PRODUCT_VARIANT_EDIT(row.original._id)}
      />,
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
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold">
              Show Product Variants
            </h4>

            <Button asChild>
              <Link
                href={ADMIN_PRODUCT_VARIANT_ADD}
                className="flex items-center gap-2"
              >
                <FiPlus />
                New Variant
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-0">
          <DatatableWrapper<ProductVariantRow>
            queryKey="product-variant-data"
            fetchUrl="/api/productvariant"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/productvariant/export"
            deleteEndpoint="/api/productvariant/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=productvariant`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowProductVariantClient;
