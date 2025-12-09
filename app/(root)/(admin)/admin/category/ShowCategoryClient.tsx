/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import {
  ADMIN_CATEGORY_ADD,
  ADMIN_CATEGORY_EDIT,
  ADMIN_CATEGORY_SHOW,
  ADMIN_DASHBOARD,
  ADMIN_TRASH,
} from "@/routes/AdminPanelRoute";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import Link from "next/link";
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import { JSX, useCallback, useMemo } from "react";
import { columnConfig } from "@/lib/helper";
import { DT_CATEGORY_COLUMN } from "@/lib/column";
import EditAction from "@/components/Application/Admin/EditAction";
import DeleteAction from "@/components/Application/Admin/DeleteAction";

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_CATEGORY_SHOW, label: "Category" },
];

const ShowCategoryClient = () => {
  const columns = useMemo(() => columnConfig(DT_CATEGORY_COLUMN), []);

  const action = useCallback(
    (
      row: any,
      deleteType: "SD" | "PD" | "RSD",
      handleDelete: (ids: string[], deleteType: "SD" | "PD" | "RSD") => void
    ) => [
      <EditAction
        key="edit"
        href={ADMIN_CATEGORY_EDIT(row.original._id)}
      />,
      <DeleteAction
        key="delete"
        handleDelete={handleDelete}
        row={row}
        deleteType={deleteType}
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
            <h4 className="text-xl font-semibold">Show Category</h4>

            <Button asChild>
              <Link
                href={ADMIN_CATEGORY_ADD}
                className="flex items-center gap-2"
              >
                <FiPlus />
                New Category
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-0">
          <DatatableWrapper
            queryKey="category-data"
            fetchUrl="/api/category"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/category/export"
            deleteEndpoint="/api/category/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=category`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowCategoryClient;
