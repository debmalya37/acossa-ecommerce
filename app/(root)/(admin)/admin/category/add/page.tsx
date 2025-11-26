/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import { ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD } from "@/routes/AdminPanelRoute";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
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
import slugify from "slugify";
import z from "zod";

/* ----------------------------------------
   ✔ TypeScript Type Inference from Zod
----------------------------------------- */
const addCategorySchema = zodSchema.pick({
  name: true,
  slug: true,
});

type AddCategoryFormValues = z.infer<typeof addCategorySchema>;

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_CATEGORY_SHOW, label: "Category" },
  { href: "", label: "Add Category" },
];

const AddCategory = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<AddCategoryFormValues>({
    resolver: zodResolver(addCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  /* ----------------------------------------
     Auto-generate slug when name changes
  ----------------------------------------- */
  useEffect(() => {
    const subscription = form.watch((values) => {
      if (values.name) {
        form.setValue("slug", slugify(values.name, { lower: true }));
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  /* ----------------------------------------
     Submit Handler (Fully Typed)
  ----------------------------------------- */
  const onSubmit: SubmitHandler<AddCategoryFormValues> = async (values) => {
    setLoading(true);

    try {
      const { data: response } = await axios.post("/api/category/create", values);

      if (!response.success) {
        throw new Error(response.message);
      }

      form.reset();
      showToast("success", response.message);
    } catch (error: any) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0">
        <CardHeader className="pt-2 px-3 border-b [.border-b]:pb-2">
          <h4 className="text-xl font-semibold">Add Category</h4>
        </CardHeader>

        <CardContent className="pb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter category name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug Field */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter slug"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="mb-3">
                <ButtonLoading
                  loading={loading}
                  type="submit"
                  text="Add Category"
                  className="cursor-pointer"
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCategory;
