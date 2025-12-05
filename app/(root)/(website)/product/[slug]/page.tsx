/* eslint-disable @typescript-eslint/no-explicit-any */
import ProductDetails from "../ProductDetails";

interface ProductPageProps {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { slug } = params;
  const color = searchParams?.color;
  const size = searchParams?.size;

  let url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/product/details/${slug}`;

  if (color || size) {
    const qs = new URLSearchParams();
    if (color) qs.set("color", color as string);
    if (size) qs.set("size", size as string);
    url += `?${qs.toString()}`;
  }

  // ❗Use native fetch instead of axios
  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="flex justify-center items-center py-10 h-[300px]">
        <h1 className="text-4xl font-semibold">Product not found</h1>
      </div>
    );
  }

  const getProduct = await res.json();
  console.log("GET PRODUCT RESPONSE:", getProduct);

  if (!getProduct.success) {
    return (
      <div className="flex justify-center items-center py-10 h-[300px]">
        <h1 className="text-4xl font-semibold">Product not found</h1>
      </div>
    );
  }

  return (
    <ProductDetails
      product={getProduct?.data?.product}
      variant={getProduct?.data?.variant}
      colors={getProduct?.data?.colors}
      sizes={getProduct?.data?.sizes}
      reviewCount={getProduct?.data?.reviewCount}
      addons={getProduct?.data?.addons}
    />
  );
}
