/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import Papa from "papaparse";
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { ADMIN_DASHBOARD, ADMIN_PRODUCT_SHOW } from '@/routes/AdminPanelRoute'
import { useEffect, useState, ChangeEvent } from "react"
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import zodSchema from '@/lib/zodSchema'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import ButtonLoading from '@/components/Application/LoadingButton'
import { showToast } from "@/lib/showToast"
import axios from "axios"
import slugify from 'slugify'
import useFetch from '@/hooks/useFetch'
import Select from '@/components/Select'
import Editor from '@/components/Application/Admin/Editor'
import ModalMedia from '@/components/Application/Admin/ModalMedia'
import Image from 'next/image'

interface MediaItem {
  _id: string;
  secure_url?: string;
  thumbnail_url?: string;
  path?: string;
  alt?: string;
}

const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Home' },
    { href: ADMIN_PRODUCT_SHOW, label: 'Products' },
    { href: '', label: 'Add Product' },

]
const AddProduct = () => {
    const [loading, setLoading] = useState(false)
    const { data: getCategory } = useFetch<{
  success: boolean;
  data: { _id: string; name: string }[];
}>('/api/category?deleteType=SD&&size=10000');




    const [categoryOption, setCategoryOption] = useState<
  { label: string; value: string }[]
>([]);

    //media modal states
    const [open, setOpen] = useState(false)
    const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([])

    const addProductSchema = zodSchema.pick({
        name: true,
        slug: true,
        category: true,
        mrp: true,
        sellingPrice: true,
        discountPercentage: true,
        description: true
    })
    const form = useForm({
        resolver: zodResolver(addProductSchema),
        defaultValues: {
            name: "",
            slug: "",
            category: "",
            mrp: "",
            sellingPrice: "",
            discountPercentage: "",
            description: ""
        },
    })
    useEffect(() => {
  // Convert form values to numbers safely
  const mrp = Number(form.getValues("mrp"));
  const sellingPrice = Number(form.getValues("sellingPrice"));

  if (!isNaN(mrp) && !isNaN(sellingPrice) && mrp > 0 && sellingPrice > 0) {
    const dp = ((mrp - sellingPrice) / mrp) * 100;
    form.setValue("discountPercentage", Math.round(dp));
  }
}, [form, form.watch("mrp"), form.watch("sellingPrice")]);

    useEffect(() => {
  if (getCategory?.success && Array.isArray(getCategory.data)) {
    const data = getCategory.data;
    const options = data.map((cat) => ({
      label: cat.name,
      value: cat._id,
    }));
    setCategoryOption(options);
  }
}, [getCategory]);

    useEffect(() => {
        const name = form.getValues('name')
        if (name) {
            form.setValue('slug', slugify(name).toLowerCase())
        }
    }, [form.watch('name')])

    const onSubmit = async (values:any) => {
        setLoading(true)
        try {
            if (selectedMedia.length <= 0) {
                return showToast('error', 'Please select media.')
            }
            const mediaIds = selectedMedia.map((media:any) => media._id)
            values.media = mediaIds
            const { data: response } = await axios.post('/api/product/create', values)
            if (!response.success) {
                throw new Error(response.message)
            }
            form.reset()
            showToast('success', response.message)
        } catch (error:any) {
            showToast('error', error.message)
        } finally {
            setLoading(false)
        }
    }
    console.log(selectedMedia)


   const handleXLSXUpload = async (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const XLSX = await import("xlsx");

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);

    // ✅ Sheet names MUST match Excel
    const productsSheet = workbook.Sheets["Products"];
    const variantsSheet = workbook.Sheets["Variants"];
    const addonsSheet = workbook.Sheets["product_addons"]; // ✅ ADD THIS

    if (!productsSheet) return showToast("error", "Products sheet not found");
    if (!variantsSheet) return showToast("error", "Variants sheet not found");
    if (!addonsSheet) return showToast("error", "Product Addons sheet not found");

    const products = XLSX.utils.sheet_to_json(productsSheet);
    const variants = XLSX.utils.sheet_to_json(variantsSheet);
    const productAddons = XLSX.utils.sheet_to_json(addonsSheet); // ✅ ADD THIS

    const { data: res } = await axios.post("/api/product/import", {
      products,
      variants,
      productAddons, // ✅ SEND THIS
    });

    showToast("success", res.message);
  } catch (error: any) {
    showToast("error", error.message || "Import failed");
  }
};



    const handleCSVUpload = async (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: async (results) => {
      try {
        const { data } = await axios.post("/api/product/import", {
          rows: results.data,
        });

        showToast("success", data.message);
      } catch (error) {
        let message = "An error occurred";
        if (axios.isAxiosError(error)) {
          message = error.response?.data?.message || error.message;
        } else if (error instanceof Error) {
          message = error.message;
        }
        showToast("error", message);
      }
    },
  });
};
    return (
        <div>
            <BreadCrumb breadcrumbData={breadcrumbData} />

            <input
  type="file"
  accept=".xlsx"
  id="import_xlsx"
  className="hidden"
  onChange={handleXLSXUpload}
/>

<label
  htmlFor="import_xlsx"
  className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-white rounded-md mb-4"
>
  Import Products (XLSX)
</label>


            <Card className={"py-0"}>
                <CardHeader className={"pt-2 px-3 border-b [.border-b]:pb-2"}>
                    <h4 className="text-xl font-semibold">Add Product</h4>
                </CardHeader>
                <CardContent className={"pb-5"}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} >
                            <div className="grid md:grid-cols-2 grid-cols-1  gap-5">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name <span className='text-red-500'>*</span></FormLabel>
                                            <FormControl>
                                                <Input type={"text"} placeholder="Enter product name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug <span className='text-red-500'>*</span></FormLabel>
                                            <FormControl>
                                                <Input type={"text"} placeholder="Enter slug" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category <span className='text-red-500'>*</span></FormLabel>
                                            <FormControl>
                                                <Select
                                                    options={categoryOption}
                                                    selected={field.value}
                                                    setSelected={field.onChange}
                                                    isMulti={false}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="mrp"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>MRP <span className='text-red-500'>*</span></FormLabel>
                                            <FormControl>
                                                <Input type={"number"} placeholder="Enter mrp" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="discountPercentage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Discount Percentage <span className='text-red-500'>*</span></FormLabel>
                                            <FormControl>
                                                <Input type={"number"} readOnly placeholder="Enter discount percentage" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="sellingPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Selling Price <span className='text-red-500'>*</span></FormLabel>
                                            <FormControl>
                                                <Input type={"number"} placeholder="Enter selling price" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description <span className='text-red-500'>*</span></FormLabel>
                                            <FormControl>
                                                <Input type={"text"} placeholder="Enter description" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className='md:col-span-2 border border-dashed rounded p-5 text-center mt-5'>
                                <ModalMedia
                                    open={open}
                                    setOpen={setOpen}
                                    selectedMedia={selectedMedia}
                                    setSelectedMedia={setSelectedMedia}
                                    isMultiple={true}
                                />
                                {
                                    selectedMedia.length > 0
                                    && <div className='flex justify-center items-center flex-wrap mb-3 gap-2'>
                                        {selectedMedia.map((media:any) => (
                                            <div key={media._id} className='h-24 w-24 border'>
                                                <Image
                                                    src={media.secure_url}
                                                    height={100}
                                                    width={100}
                                                    alt="image"
                                                    className='size-full object-cover'
                                                />
                                            </div>
                                        ))}
                                    </div>

                                }
                                <div onClick={() => setOpen(true)} className='bg-gray-50 dark:bg-card  border w-[200px] mx-auto p-5 cursor-pointer'>
                                    <span className='font-semibold'>
                                        Select Media
                                    </span>
                                </div>
                            </div>

                            <div className='mb-3 mt-5'>
                                <ButtonLoading
                                    loading={loading}
                                    type={"submit"}
                                    text="Add Product"
                                    className={"cursor-pointer"}
                                />
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default AddProduct