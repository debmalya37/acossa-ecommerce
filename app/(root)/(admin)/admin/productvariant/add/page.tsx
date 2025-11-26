/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import {
  ADMIN_DASHBOARD,
  ADMIN_PRODUCT_VARIANT_SHOW,
} from "@/routes/AdminPanelRoute";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import zodSchema from "@/lib/zodSchema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import ButtonLoading from "@/components/Application/LoadingButton";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import useFetch, { ApiResponse } from "@/hooks/useFetch";
import Select from "@/components/Select";
import ModalMedia from "@/components/Application/Admin/ModalMedia";
import Image from "next/image";
import { sizes } from "@/lib/utils";
import { z } from "zod";

/* --------------------------------------------------------
   ✔ Extract Zod Schema for Form
---------------------------------------------------------- */
const addProductVariantSchema = zodSchema.pick({
  product: true,
  sku: true,
  color: true,
  size: true,
  mrp: true,
  sellingPrice: true,
  discountPercentage: true,
});

type AddProductVariantFormValues = z.infer<typeof addProductVariantSchema>;

/* --------------------------------------------------------
   ✔ Types
---------------------------------------------------------- */

interface Product {
  _id: string;
  name: string;
}

// interface MediaItem {
//   _id: string;
//   secure_url: string;
// }
// Use a form type that allows string | number for numeric fields because <input type="number">
// returns string values via event handlers. We'll convert to number in onSubmit.
type ProductVariantFormValues = {
  product: string;
  sku: string;
  color: string;
  size: string;
  mrp: string | number;
  sellingPrice: string | number;
  discountPercentage: string | number;
};
interface MediaItem {
  _id: string;
  secure_url?: string;
  thumbnail_url?: string;
  path?: string;
  alt?: string;
}

/* --------------------------------------------------------
   ✔ Breadcrumb
---------------------------------------------------------- */

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_PRODUCT_VARIANT_SHOW, label: "Product Variants" },
  { href: "", label: "Add Product Variant" },
];

export default function AddProductVariant() {
  /* -----------------------------
     Local States
  ------------------------------ */
  const [loading, setLoading] = useState(false);
  const [productOption, setProductOption] = useState<
    { label: string; value: string }[]
  >([]);

  const [open, setOpen] = useState(false);

  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);

  /* -----------------------------
     Fetch Products (Dropdown)
  ------------------------------ */
  const { data: getProduct } = useFetch<Product[]>(
    "/api/product?deleteType=SD&&size=10000"
  );

  /* -----------------------------
     React Hook Form
  ------------------------------ */
  const form = useForm<ProductVariantFormValues>({
  // cast resolver to avoid incompatible generic mismatch — safe because we convert values
  // to the correct numeric types in onSubmit before sending to backend.
  resolver: zodResolver(addProductVariantSchema) as unknown as Resolver<ProductVariantFormValues>,
  defaultValues: {
    product: "",
    sku: "",
    color: "",
    size: "",
    mrp: 0,
    sellingPrice: 0,
    discountPercentage: 0,
  },
});


  /* -----------------------------
     Auto Calculate Discount %
  ------------------------------ */
  useEffect(() => {
    const mrp = Number(form.getValues("mrp") || 0);
    const sp = Number(form.getValues("sellingPrice") || 0);

    if (mrp > 0 && sp > 0) {
      const dp = Math.round(((mrp - sp) / mrp) * 100);
      form.setValue("discountPercentage", (dp));
    }
  }, [form.watch("mrp"), form.watch("sellingPrice")]);

  /* -----------------------------
     Populate Product Dropdown
  ------------------------------ */
  useEffect(() => {
    if (getProduct?.success && Array.isArray(getProduct.data)) {
      const opts = getProduct.data.map((p) => ({
        label: p.name,
        value: p._id,
      }));
      setProductOption(opts);
    }
  }, [getProduct]);

  /* -----------------------------
     Submit Handler
  ------------------------------ */
  const onSubmit: SubmitHandler<ProductVariantFormValues> = async (values) => {
  setLoading(true);

  try {
    if (selectedMedia.length <= 0) {
      return showToast("error", "Please select media.");
    }

    // convert numeric strings to numbers
    const payload = {
      ...values,
      mrp: Number(values.mrp),
      sellingPrice: Number(values.sellingPrice),
      discountPercentage: Number(values.discountPercentage),
      media: selectedMedia.map((m) => m._id),
    };

    const { data: response }: { data: ApiResponse<unknown> } = await axios.post(
      "/api/productvariant/create",
      payload
    );

    if (!response.success) throw new Error(response.message);

    form.reset();
    showToast("success", response.message);
    setSelectedMedia([]);
  } catch (err: any) {
    showToast("error", err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0">
        <CardHeader className="pt-2 px-3 border-b [.border-b]:pb-2">
          <h4 className="text-xl font-semibold">Add Product Variant</h4>
        </CardHeader>

        <CardContent className="pb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                {/* Product */}
                <FormField
                  control={form.control}
                  name="product"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Product <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          options={productOption}
                          selected={field.value}
                          setSelected={field.onChange}
                          isMulti={false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SKU */}
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        SKU <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter SKU" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Color */}
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Color <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Size */}
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Size <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          options={sizes}
                          selected={field.value}
                          setSelected={field.onChange}
                          isMulti={false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* MRP */}
                <FormField
                  control={form.control}
                  name="mrp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        MRP <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter MRP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Discount % */}
                <FormField
                  control={form.control}
                  name="discountPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Discount Percentage <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input readOnly placeholder="Discount %" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Selling Price */}
                <FormField
                  control={form.control}
                  name="sellingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Selling Price <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter Selling Price" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Media Selector */}
              <div className="border border-dashed rounded p-5 text-center mt-5">
                <ModalMedia
                  open={open}
                  setOpen={setOpen}
                  selectedMedia={selectedMedia}
                  setSelectedMedia={setSelectedMedia}
                  isMultiple={true}
                />

                {selectedMedia.length > 0 && (
                  <div className="flex justify-center items-center flex-wrap mb-3 gap-2">
                    {selectedMedia.map((media) => (
                      <div key={media._id} className="h-24 w-24 border">
                        <Image
                          src={media.secure_url || media.thumbnail_url || media.path || "/placeholder.png"}
                          height={100}
                          width={100}
                          alt="media"
                          className="object-cover size-full"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div
                  onClick={() => setOpen(true)}
                  className="bg-gray-50 dark:bg-card border w-[200px] mx-auto p-5 cursor-pointer"
                >
                  <span className="font-semibold">Select Media</span>
                </div>
              </div>

              {/* Submit */}
              <div className="mt-5">
                <ButtonLoading
                  loading={loading}
                  type="submit"
                  text="Add Product Variant"
                  className="cursor-pointer"
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
