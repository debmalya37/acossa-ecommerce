/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import {
  ADMIN_COUPON_SHOW,
  ADMIN_DASHBOARD,
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

import { useForm, SubmitHandler } from "react-hook-form";
import { showToast } from "@/lib/showToast";

import axios from "axios";
import useFetch from "@/hooks/useFetch";

import dayjs from "dayjs";

/* --------------------------------------
   ✔ Extract edit schema (from master zodSchema)
   NOTE: we use the zod schema for validation but the form field types
   below are defined to match actual input element expectations:
   - validity is a YYYY-MM-DD string (for <input type="date">)
   - numeric fields are numbers
----------------------------------------- */
const editCouponSchema = zodSchema.pick({
  _id: true,
  code: true,
  minShoppingAmount: true,
  validity: true,
  discountPercentage: true,
});

type EditCouponFormValues = {
  _id: string;
  code: string;
  minShoppingAmount: number;
  validity: string; // YYYY-MM-DD
  discountPercentage: number;
};

/* --------------------------------------
   ✔ Response type for /get/:id
----------------------------------------- */
interface CouponItem {
  _id: string;
  code: string;
  minShoppingAmount: number;
  discountPercentage: number;
  validity: string; // ISO string or date string from backend
}

interface FetchCouponResponse {
  success: boolean;
  data: CouponItem;
}

/* --------------------------------------
   ✔ Route Params Type
----------------------------------------- */
interface EditCouponPageProps {
  params: {
    id: string;
  };
}

/* --------------------------------------
   ✔ Breadcrumb
----------------------------------------- */
const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_COUPON_SHOW, label: "Coupons" },
  { href: "", label: "Edit Coupon" },
];

export default function EditCouponPage({ params }: EditCouponPageProps) {
  // Use params directly — don't use `use()` in a client component
  const id = params.id;

  /* --------------------------------------
     ✔ Fetch coupon
  ----------------------------------------- */
  const { data: couponResponse } = useFetch<FetchCouponResponse>(`/api/coupon/get/${id}`);

  const [loading, setLoading] = useState(false);

  /* --------------------------------------
     ✔ Form configuration
     - validity default set to today (YYYY-MM-DD)
  ----------------------------------------- */
  const form = useForm<EditCouponFormValues>({
    // keep resolver for validation; cast to any to avoid TS noise if needed
    resolver: zodResolver(editCouponSchema) as unknown as (values: any) => any,
    defaultValues: {
      _id: id,
      code: "",
      minShoppingAmount: 0,
      validity: dayjs().format("YYYY-MM-DD"),
      discountPercentage: 0,
    },
  });

  /* --------------------------------------
     ✔ Fill form when data loads
        - convert backend validity to YYYY-MM-DD for the date input
        - ensure numeric fields are numbers (not strings)
  ----------------------------------------- */
  useEffect(() => {
  // Response structure: { success, message, data: { success, data: CouponItem } }

  if (!couponResponse?.success || !couponResponse.data?.data) return;

  const c = couponResponse.data.data;

  const validityStr = c.validity
    ? dayjs(c.validity).format("YYYY-MM-DD")
    : dayjs().format("YYYY-MM-DD");

  form.reset({
    _id: c._id,
    code: c.code ?? "",
    minShoppingAmount: Number(c.minShoppingAmount) || 0,
    discountPercentage: Number(c.discountPercentage) || 0,
    validity: validityStr,
  });
}, [couponResponse, form]);


  /* --------------------------------------
     ✔ Submit Handler
        - convert validity back to ISO string before sending
  ----------------------------------------- */
  const onSubmit: SubmitHandler<EditCouponFormValues> = async (values) => {
    setLoading(true);

    try {
      // Prepare payload: convert date string to ISO format (or whatever backend expects)
      const payload = {
        ...values,
        // convert YYYY-MM-DD -> ISO string (00:00:00 UTC local)
        validity: new Date(values.validity).toISOString(),
      };

      const { data: response } = await axios.put("/api/coupon/update", payload);

      if (!response.success) throw new Error(response.message);

      showToast("success", response.message);
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------
     ✔ Render
  ----------------------------------------- */
  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0">
        <CardHeader className="pt-2 px-3 border-b [.border-b]:pb-2">
          <h4 className="text-xl font-semibold">Edit Coupon</h4>
        </CardHeader>

        <CardContent className="pb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-5">

                {/* CODE */}
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Code <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter code" {...field} />
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
                      <FormLabel>
                        Discount Percentage <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter discount %"
                          {...field}
                          // ensure the value fed to input is string | number — RHF will handle number values
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* MIN SHOPPING AMOUNT */}
                <FormField
                  control={form.control}
                  name="minShoppingAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Minimum Shopping Amount <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter minimum shopping amount"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* VALIDITY */}
                <FormField
                  control={form.control}
                  name="validity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Validity <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        {/* field.value is a string in YYYY-MM-DD format */}
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-3 mt-5">
                <ButtonLoading
                  loading={loading}
                  type="submit"
                  text="Update Coupon"
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
