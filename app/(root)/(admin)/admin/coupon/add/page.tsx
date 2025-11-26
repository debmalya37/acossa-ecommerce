"use client";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import {
  ADMIN_COUPON_SHOW,
  ADMIN_DASHBOARD,
} from "@/routes/AdminPanelRoute";

import { useState } from "react";
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
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import ButtonLoading from "@/components/Application/LoadingButton";

import { showToast } from "@/lib/showToast";
import axios from "axios";

/* ----------------------------------------------------
   ✔ EXTRACT SCHEMA FOR THIS FORM
------------------------------------------------------ */
const addCouponSchema = zodSchema.pick({
  code: true,
  minShoppingAmount: true,
  validity: true,
  discountPercentage: true,
});

type AddCouponFormValues = z.infer<typeof addCouponSchema>;

/* ----------------------------------------------------
   ✔ Breadcrumb
------------------------------------------------------ */
const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_COUPON_SHOW, label: "Coupons" },
  { href: "", label: "Add Coupon" },
];

/* ----------------------------------------------------
   ✔ Component
------------------------------------------------------ */
export default function AddCouponPage() {
  const [loading, setLoading] = useState(false);

  const form = useForm<AddCouponFormValues>({
    resolver: zodResolver(addCouponSchema) as unknown as Resolver<AddCouponFormValues>,
    defaultValues: {
      code: "",
      minShoppingAmount: 0,
      validity: new Date(),
      discountPercentage: 0,
    },
  });

  // Helper to format Date object to YYYY-MM-DD string for input[type="date"]
const dateToInputString = (date: Date): string => {
    if (date instanceof Date && !isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
    }
    return "";
};
  /* ----------------------------------------------------
     ✔ Submit Handler (Strongly Typed)
  ------------------------------------------------------ */
  const onSubmit: SubmitHandler<AddCouponFormValues> = async (values) => {
    setLoading(true);

    try {
      const { data: response } = await axios.post("/api/coupon/create", values);

      if (!response.success) {
        throw new Error(response.message);
      }

      form.reset();
      showToast("success", response.message);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------------------------
     ✔ Render
  ------------------------------------------------------ */
  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0">
        <CardHeader className="pt-2 px-3 border-b [.border-b]:pb-2">
          <h4 className="text-xl font-semibold">Add Coupon</h4>
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
                        <Input type="number" placeholder="Enter discount %" {...field} />
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
                         <Input
                          type="date"
                          className="w-full border-gray-300 focus:border-blue-500"
                          // Use the helper to convert the Date object to a string for the input
                          value={dateToInputString(field.value)}
                          // Convert the input string back to a Date object for RHF
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
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
                  text="Add Coupon"
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
