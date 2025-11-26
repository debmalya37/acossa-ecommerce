/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Chip } from "@mui/material";
import dayjs from "dayjs";
import userIcon from "@/public/assets/images/user.png";
import { MRT_ColumnDef } from "material-react-table";

/* ---------------------------
   CATEGORY COLUMNS
---------------------------- */
export const DT_CATEGORY_COLUMN: MRT_ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Category Name",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
];

/* ---------------------------
   CUSTOMERS COLUMNS
---------------------------- */
export const DT_CUSTOMERS_COLUMN: MRT_ColumnDef<any>[] = [
  {
    accessorKey: "avatar",
    header: "Avatar",
    Cell: ({ renderedCellValue }) => {
  const avatar = renderedCellValue as { url?: string } | null;

  return (
    <Avatar>
      <AvatarImage src={avatar?.url ?? userIcon.src} />
    </Avatar>
  );
},

  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "isEmailVerified",
    header: "Is Verified",
    Cell: ({ renderedCellValue }): React.ReactNode =>
      renderedCellValue ? (
        <Chip color="success" label="Verified" />
      ) : (
        <Chip color="error" label="Not Verified" />
      ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
];

/* ---------------------------
   REVIEWS COLUMNS
---------------------------- */
export const DT_REVIEWS_COLUMN: MRT_ColumnDef<any>[] = [
  {
    accessorKey: "product",
    header: "Product",
  },
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "rating",
    header: "Rating",
  },
  {
    accessorKey: "review",
    header: "Review",
  },
];

/* ---------------------------
   COUPON COLUMNS
---------------------------- */
export const DT_COUPON_COLUMN: MRT_ColumnDef<any>[] = [
  { accessorKey: "code", header: "Code" },
  { accessorKey: "minShoppingAmount", header: "Minimum Shopping Amount" },
  { accessorKey: "discountPercentage", header: "Discount Percentage" },
  {
    accessorKey: "validity",
    header: "Validity",
    Cell: ({ renderedCellValue }) => {
      const value = renderedCellValue as string; // 👈 CAST FIX

      const formatted = dayjs(value).format("DD/MM/YYYY");
      const isExpired = new Date() > new Date(value);

      return isExpired ? (
        <Chip color="error" label={formatted} />
      ) : (
        <Chip color="success" label={formatted} />
      );
    },
  },
];

/* ---------------------------
   PRODUCT COLUMNS
---------------------------- */
export const DT_PRODUCT_COLUMN: MRT_ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Product Name",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "mrp",
    header: "MRP",
  },
  {
    accessorKey: "sellingPrice",
    header: "Selling Price",
  },
  {
    accessorKey: "discountPercentage",
    header: "Discount Percentage",
  },
];

/* ---------------------------
   PRODUCT VARIANT COLUMNS
---------------------------- */
export const DT_PRODUCT_VARIANT_COLUMN: MRT_ColumnDef<any>[] = [
  {
    accessorKey: "product",
    header: "Product Name",
  },
  {
    accessorKey: "color",
    header: "Color",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "mrp",
    header: "MRP",
  },
  {
    accessorKey: "sellingPrice",
    header: "Selling Price",
  },
  {
    accessorKey: "discountPercentage",
    header: "Discount Percentage",
  },
];
