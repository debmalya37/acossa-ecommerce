/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import { ADMIN_DASHBOARD, ADMIN_TRASH } from "@/routes/AdminPanelRoute";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import { useCallback, useMemo } from "react";
import { columnConfig } from "@/lib/helper";

import DeleteAction from "@/components/Application/Admin/DeleteAction";
import { DT_REVIEWS_COLUMN } from "@/lib/column";

/* --------------------------------------------------------------------
   Types
-------------------------------------------------------------------- */
export interface ReviewRow {
  _id: string;
  user: string;
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
}

/* Action menu props */
interface ActionCallbackProps {
  row: any;
  deleteType: "SD" | "PD" | "RSD";
  handleDelete: (row: any, deleteType: "SD" | "PD" | "RSD") => void;
}

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: "", label: "Review" },
];

export default function ShowReview() {
  /* -------------------------------------
     Typed columns config
  ------------------------------------- */
  const columns = useMemo(() => {
    return columnConfig(DT_REVIEWS_COLUMN);
  }, []);

  /* -------------------------------------
     Typed action buttons
  ------------------------------------- */
  const action = useCallback(
  (
    row: any,
    deleteType: "SD" | "PD" | "RSD",
    handleDelete: (ids: string[], deleteType: "SD" | "PD" | "RSD") => void
  ) => {
    return [
      <DeleteAction
        key="delete"
        row={row}
        deleteType={deleteType}
        handleDelete={() => handleDelete([row.original._id], deleteType)}
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
            <h4 className="text-xl font-semibold">Reviews</h4>
          </div>
        </CardHeader>

        <CardContent className="px-0">
          <DatatableWrapper
            queryKey="review-data"
            fetchUrl="/api/review"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/review/export"
            deleteEndpoint="/api/review/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=review`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
}
