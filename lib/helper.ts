import { NextResponse } from "next/server";

/**
 * Success / Error Response Wrapper
 * - Fully Next.js type-safe
 * - Returns standard Response instead of NextResponse<T>
 * - Works with typed route validation
 */
export function response(
  success: boolean,
  statusCode: number,
  message: string,
  data: Record<string, any> = {}
): NextResponse {
  return NextResponse.json(
    {
      success,
      statusCode,
      message,
      data,
    },
    { status: statusCode }
  );
}

/**
 * Error Handler
 * - Handles duplicate field errors
 * - Sends normalized response
 * - Always returns standard Response (not NextResponse)
 */
export function catchError(error: any, customMessage?: string): Response {
  // mongo duplicate key error
  if (error?.code === 11000) {
    const keys = Object.keys(error.keyPattern || {}).join(", ");
    error.message = `Duplicate fields: ${keys}. The value of these fields must be unique.`;
  }

  const isDev = process.env.NODE_ENV === "development";

  const payload: any = {
    success: false,
    statusCode: error?.code || 500,
    message: isDev
      ? error?.message || "Internal error"
      : customMessage || "Internal server error",
  };

  if (isDev) {
    payload.error = error;
  }

  return Response.json(payload, {
    status: error?.statusCode || 500,
  });
}

/**
 * Generate 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Column Config Builder (Admin Table Helper)
 */
export function columnConfig(
  column: any[],
  isCreatedAt = false,
  isUpdatedAt = false,
  isDeletedAt = false
) {
  const newColumn = [...column];

  const addColumn = (
    key: string,
    label: string,
    enabled: boolean
  ) => {
    if (enabled) {
      newColumn.push({
        accessorKey: key,
        header: label,
        Cell: ({ renderedCellValue }: any) =>
          new Date(renderedCellValue).toLocaleString(),
      });
    }
  };

  addColumn("createdAt", "Created At", isCreatedAt);
  addColumn("updatedAt", "Updated At", isUpdatedAt);
  addColumn("deletedAt", "Deleted At", isDeletedAt);

  return newColumn;
}
