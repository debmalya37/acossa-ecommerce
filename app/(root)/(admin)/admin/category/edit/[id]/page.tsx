"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import useFetch from "@/hooks/useFetch";
import { z } from "zod";
import { useParams } from "next/navigation";

/* ---------------- Schema ---------------- */
const updateCategorySchema = zodSchema.pick({
  _id: true,
  name: true,
  slug: true,
});

type UpdateCategoryFormValues = z.infer<typeof updateCategorySchema>;

/* ---------------- Types ---------------- */
interface EditCategoryPageProps {
  params: {
    id: string;
  };
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

const EditCategory = () => {

  const params = useParams();
  const id = params.id as string;

  // Fetch category by ID
  const { data: categoryData } = useFetch<Category>(`/api/category/${id}`)


  const [loading, setLoading] = useState(false);

  const form = useForm<UpdateCategoryFormValues>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      _id: id,
      name: "",
      slug: "",
    },
  });

  /* ------------ Load fetched data ------------ */
  useEffect(() => {
    if (categoryData?.success && categoryData?.data) {
      const d = categoryData.data;
      form.reset({
        _id: d._id,
        name: d.name,
        slug: d.slug,
      });
    }
  }, [categoryData, form]);

  /* ------------ Auto Slug ------------ */
  const nameValue = form.watch("name");

  useEffect(() => {
    if (nameValue) {
      const newSlug = slugify(nameValue, { lower: true });
      if (form.getValues("slug") !== newSlug) {
        form.setValue("slug", newSlug, { shouldDirty: true });
      }
    }
  }, [nameValue, form]);

  /* ------------ Submit ------------ */
  const onSubmit: SubmitHandler<UpdateCategoryFormValues> = async (values) => {
    setLoading(true);
    try {
      const { data: response } = await axios.put("/api/category/update", values);

      if (!response.success) throw new Error(response.message);

      showToast("success", response.message);
    } catch (error: any) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <BreadCrumb breadcrumbData={[
        { href: ADMIN_DASHBOARD, label: "Home" },
        { href: ADMIN_CATEGORY_SHOW, label: "Category" },
        { href: "", label: "Edit Category" }
      ]} />

      <Card>
        <CardHeader>
          <h4 className="text-xl font-semibold">Edit Category</h4>
        </CardHeader>

        <CardContent>
          <Form {...(form as any)}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              {/* NAME */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
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
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <ButtonLoading loading={loading} type="submit" text="Update Category" />
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCategory;
