/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import {
  ADMIN_DASHBOARD,
  ADMIN_PRODUCT_SHOW,
} from "@/routes/AdminPanelRoute";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { z } from "zod";
import zodSchema from "@/lib/zodSchema";

import { zodResolver } from "@hookform/resolvers/zod";
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

import { useForm, SubmitHandler, Resolver } from "react-hook-form"; // <-- added Resolver
import { showToast } from "@/lib/showToast";

import axios from "axios";
import useFetch from "@/hooks/useFetch";
import Select from "@/components/Select";
import ModalMedia from "@/components/Application/Admin/ModalMedia";
import Image from "next/image";
import { useParams } from "next/navigation";


/* -----------------------------------------
   Zod schema + Types
------------------------------------------ */
const productSchema = zodSchema.pick({
  _id: true,
  name: true,
  slug: true,
  category: true,
  mrp: true,
  sellingPrice: true,
  discountPercentage: true,
  description: true,
});

type ProductFormValues = z.infer<typeof productSchema> & {
  media?: string[];
};

/* -----------------------------------------
   Fetch Types
------------------------------------------ */
interface CategoryItem {
  _id: string;
  name: string;
}

interface MediaItem {
  _id: string;
  secure_url?: string;
  thumbnail_url?: string;
  path?: string;
  alt?: string;
}

interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  category: string;
  mrp: number;
  sellingPrice: number;
  discountPercentage: number;
  description: string;
  media?: MediaItem[];
}

interface EditProductPageProps {
  params: {
    id: string;
  };
}

/* -----------------------------------------
   Breadcrumb
------------------------------------------ */
const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_PRODUCT_SHOW, label: "Products" },
  { href: "", label: "Edit Product" },
];

/* -----------------------------------------
   Component
------------------------------------------ */
export default function EditProduct() {
  const params = useParams();
  const id = params.id as string;

  /* Fetch category list */
  const { data: categoryResponse } = useFetch<{
    success: boolean;
    data: CategoryItem[];
  }>("/api/category?deleteType=SD&&size=10000");

  /* Fetch product details */
  const { data: productResponse } = useFetch<ProductItem>(`/api/productvariant/get/${id}`);

  const [categoryOption, setCategoryOption] = useState<
    { label: string; value: string }[]
  >([]);

  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  /* -----------------------------------------
     Form Config
     - cast the resolver to the correct Resolver<ProductFormValues> type
  ------------------------------------------ */
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as unknown as Resolver<ProductFormValues>,
    defaultValues: {
      _id: id,
      name: "",
      slug: "",
      category: "",
      mrp: 0,
      sellingPrice: 0,
      discountPercentage: 0,
      description: "",
    },
  });

  /* -----------------------------------------
     Load product data into form
     - ensure we use productResponse.data (not productResponse.data.data)
  ------------------------------------------ */
  useEffect(() => {
  if (!productResponse?.success || !productResponse.data) return;

  const p = productResponse.data;

  form.reset({
    _id: p._id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    mrp: p.mrp,
    sellingPrice: p.sellingPrice,
    discountPercentage: p.discountPercentage,
    description: p.description,
  });

  setSelectedMedia(p.media ?? []);
}, [productResponse, form]);

  /* -----------------------------------------
     Map category options
  ------------------------------------------ */
  useEffect(() => {
    if (categoryResponse?.success && Array.isArray(categoryResponse.data)) {
      const mapped = categoryResponse.data.map((c) => ({
        label: c.name,
        value: c._id,
      }));
      setCategoryOption(mapped);
    }
  }, [categoryResponse]);

  /* -----------------------------------------
     Auto discount calculation
  ------------------------------------------ */
  const mrp = form.watch("mrp");
  const sp = form.watch("sellingPrice");

  useEffect(() => {
    const m = Number(mrp);
    const s = Number(sp);

    if (m > 0 && s > 0) {
      const dp = Math.round(((m - s) / m) * 100);

      if (form.getValues("discountPercentage") !== dp) {
        form.setValue("discountPercentage", dp);
      }
    }
  }, [mrp, sp, form]);

  /* -----------------------------------------
     Submit Handler
  ------------------------------------------ */
  const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    setLoading(true);
    try {
      values.media = selectedMedia.map((m) => m._id);

      const { data: res } = await axios.put("/api/product/update", values);

      if (!res.success) throw new Error(res.message);

      showToast("success", res.message);
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------
     UI
  ------------------------------------------ */
  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0">
        <CardHeader className="pt-2 px-3 border-b [.border-b]:pb-2">
          <h4 className="text-xl font-semibold">Edit Product</h4>
        </CardHeader>

        <CardContent className="pb-5">
          <Form {...(form as any)}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                {/* NAME */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SLUG */}
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CATEGORY */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <FormControl>
                        <Select
                          options={categoryOption}
                          selected={field.value}
                          setSelected={field.onChange}
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
                      <FormLabel>MRP *</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter mrp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* DISCOUNT */}
                <FormField
                  control={form.control}
                  name="discountPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount %</FormLabel>
                      <FormControl>
                        <Input type="number" readOnly {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SELLING PRICE */}
                <FormField
                  control={form.control}
                  name="sellingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selling Price *</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter price" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* DESCRIPTION */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* MEDIA */}
              <div className="border border-dashed rounded p-5 text-center mt-5">
                <ModalMedia
                  open={open}
                  setOpen={setOpen}
                  selectedMedia={selectedMedia}
                  setSelectedMedia={setSelectedMedia}
                  isMultiple
                />

                {selectedMedia.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mb-3">
                    {selectedMedia.map((m) => (
                      <div key={m._id} className="h-24 w-24 border">
                        <Image
                          src={m.secure_url || m.thumbnail_url || m.path || "/placeholder.png"}
                          alt="media"
                          height={100}
                          width={100}
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

              {/* SUBMIT */}
              <div className="mt-5">
                <ButtonLoading
                  loading={loading}
                  type="submit"
                  text="Update Product"
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
