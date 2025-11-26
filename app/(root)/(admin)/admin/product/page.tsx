/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import {
  ADMIN_DASHBOARD,
  ADMIN_PRODUCT_ADD,
  ADMIN_PRODUCT_EDIT,
  ADMIN_PRODUCT_SHOW,
  ADMIN_TRASH,
} from "@/routes/AdminPanelRoute";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import Link from "next/link";
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import { useCallback, useMemo } from "react";
import { columnConfig } from "@/lib/helper";
import { DT_PRODUCT_COLUMN } from "@/lib/column";
import EditAction from "@/components/Application/Admin/EditAction";
import DeleteAction from "@/components/Application/Admin/DeleteAction";

/* -------------------------------------------
   Breadcrumb Data
-------------------------------------------- */
const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_PRODUCT_SHOW, label: "Product" },
];

/* -------------------------------------------
   Types for Datatable Row (Optional but Good)
-------------------------------------------- */
interface ProductRow {
  _id: string;
  name: string;
  slug: string;
  category: string;
  mrp: number;
  sellingPrice: number;
  discountPercentage: number;
}

const ShowProduct = () => {
  /* -------------------------------------------
     Build columns (memoized)
  -------------------------------------------- */
  const columns = useMemo(() => {
    return columnConfig(DT_PRODUCT_COLUMN);
  }, []);

  /* -------------------------------------------
     Action buttons for each row
  -------------------------------------------- */
  const action = useCallback(
    (row: any, deleteType: "SD" | "PD" | "RSD", handleDelete: (ids: string[], deleteType: "SD" | "PD" | "RSD") => void) => {
      return [
        <EditAction key="edit" href={ADMIN_PRODUCT_EDIT(row.original._id)} />,
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

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0 gap-0">
        <CardHeader className="pt-2 px-3 border-b [.border-b]:pb-2">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold">Show Products</h4>

            <Button asChild>
              <Link href={ADMIN_PRODUCT_ADD} className="flex items-center gap-2">
                <FiPlus />
                New Product
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-0">
          <DatatableWrapper
            queryKey="product-data"
            fetchUrl="/api/product"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/product/export"
            deleteEndpoint="/api/product/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=product`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowProduct;