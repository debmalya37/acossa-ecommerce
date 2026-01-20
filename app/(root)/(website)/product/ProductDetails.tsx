/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import chart1 from "@/public/assets/images/chart1.jpeg";
import chart2 from "@/public/assets/images/chart2.jpeg";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Image from 'next/image';
import imgPlaceHolder from "@/public/assets/images/img-placeholder.webp";
import { IoStar } from 'react-icons/io5';
import Link from 'next/link';
import { PRODUCT_DETAILS } from '@/routes/WebsiteRoute';
import { HiMinus, HiPlus } from 'react-icons/hi';
import ButtonLoading from '@/components/Application/LoadingButton';
import { useDispatch } from 'react-redux';
import { addIntoCart } from '@/store/reducer/cartReducer';
import { showToast } from '@/lib/showToast';
import { Button } from '@/components/ui/button';
import loadingSvg from '@/public/assets/images/loading.svg';
import ProductReview from '@/components/Application/Website/ProductReview';
import SimilarProducts from '@/components/Application/Website/SimilarProducts';

const WHAT_WE_OFFER = [
  {
    icon: "🚚",
    title: "Free Worldwide Shipping",
    desc: "No minimum order, no hidden costs.",
  },
  {
    icon: "🇺🇸",
    title: "USA Duty-Paid Service",
    desc: "No extra customs charges for U.S. customers.",
  },
  {
    icon: "🔥",
    title: "Always On-Trend",
    desc: "New fashion drops & trending collections regularly.",
  },
  {
    icon: "⏱️",
    title: "24/7 Customer Support",
    desc: "We’re always here to help.",
  },
  {
    icon: "🎨",
    title: "Customisation Available",
    desc: "Tailored to your style & size.",
  },
];


const decode = (html?: string): string => {
  if (!html) return "";
  // Browser environment: use a textarea to decode HTML entities
  if (typeof window !== "undefined") {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }
  // Fallback for non-browser environments (simple common entities)
  return html
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
};

interface Media {
  _id: string;
  secure_url: string;
}

interface Variant {
  _id: string;
  color: string;
  size: string;
  mrp: number;
  sellingPrice: number;
  discountPercentage: number;
  media: Media[];
}

interface Product {
  _id: string;
  name: string;
  media: Media[];
  slug: string;
  description?: string;
}
interface AddonOption {
  value: string;
  label: string;
  price: number;
}

interface ProductAddon {
  _id: string;
  key: string;
  label: string;
  type: "checkbox" | "radio" | "select";
  basePrice: number;
  required: boolean;
  options?: AddonOption[];
}


interface ProductDetailsProps {
  product: Product;
  variant: Variant;
  colors: string[];
  sizes: string[];
  reviewCount: number;
  addons?: ProductAddon[];
}

const AccordionItem = ({
  title,
  content,
}: {
  title: string;
  content: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-4 flex justify-between items-center text-left"
      >
        <span className="tracking-widest text-sm font-medium uppercase">
          {title}
        </span>
        <span className="text-xl">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="pb-4 text-sm text-gray-700 leading-relaxed">
          {content}
        </div>
      )}
    </div>
  );
};


const ProductDetails: React.FC<ProductDetailsProps> = ({product, variant, colors, sizes, reviewCount, addons}) => {
    const {slug}= useParams<{ slug: string }>();
    const [activeThumb, setActiveThumb] = useState<string | undefined>();
    const [qty, setQty] = useState<number>(1);
    const [isAddedIntoCart, setIsAddedIntoCart] = useState<boolean>(false);
    const [selectedAddons, setSelectedAddons] = useState<Record<string, any>>({});
    const [isProductLoading, setIsProductLoading] = useState<boolean>(false);


    const  dispatch = useDispatch();
    const cartStore = useSelector((store: any) => store.cartStore);

    console.log("here is the product", product)
    console.log("here is the variant", variant)
    console.log("here are the addons", addons);

    useEffect (() => {
      setActiveThumb(variant?.media[0].secure_url || product?.media[0].secure_url);

    }, [variant, product]);


useEffect(() => {
      if(cartStore.count > 0) {
        const existingProduct = cartStore.products.findIndex(
          (cartProduct: any) =>
            cartProduct.productId === product._id && cartProduct.variantId === variant._id
        );  

        if(existingProduct >= 0) {
          setIsAddedIntoCart(true);
        } else {
          setIsAddedIntoCart(false);
        }
      }

      setIsProductLoading(false);
    }, [cartStore, product, variant]);
    

    const handleQty = (actionType:any) => {
      if (actionType === 'inc') {
        setQty((prevQty) => prevQty + 1);
      } else {
        if(qty !== 1) {
          setQty((prevQty) => prevQty - 1);
        }
      }
    }

    const getAddonTotal = () => {
  return Object.values(selectedAddons).reduce((sum: number, addon: any) => {
    if (!addon) return sum;

    let addonPrice = addon.basePrice || 0;

    if (addon.option) {
      addonPrice += addon.option.price || 0;
    }

    return sum + addonPrice;
  }, 0);
};

const finalPrice =
  (variant.sellingPrice * qty) + getAddonTotal();



    const handleAddToCart = () => {
  const cartProduct = {
    productId: product._id,
    variantId: variant._id,
    name: product.name,
    color: variant.color,
    size: variant.size,
    mrp: variant.mrp,
    sellingPrice: variant.sellingPrice,
    media: variant?.media[0]?.secure_url,
    qty,

    addons: Object.entries(selectedAddons).map(([key, addon]: any) => ({
      key,
      basePrice: addon.basePrice,
      option: addon.option || null,
    })),

    finalPrice,
  };

  dispatch(addIntoCart(cartProduct));
  setIsAddedIntoCart(true);
  showToast("success", "Product added to cart successfully");
  console.log("Added to cart:", cartProduct);
};


    const cart = useSelector((state:any) => state.cartStore);

    
console.log("cart now =", cart);
  return (
    <div className='mt-50 lg:px-32 px-4'>
      {isProductLoading && <div className='mt-50 fixed top-10 left-1/2 -translate-x-1/2 z-50'><Image src={loadingSvg} alt="Loading" width={80} height={80}/></div>}

      <div className="my-10">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/shop">Products</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/product/${slug}`}>{product?.name}</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
      </div>

      <div className="md:flex justify-between items-start lg:gap-10 gap-5 mb-20">
        <div className="md:w-1/2 xl:flex xl:justify-center xl:gap-5 md:sticky md:top-0">
        <div className="xl:order-last xl:mb-0 mb-5 xl:w-[calc(100%-144px)]">
          <Image src={activeThumb || imgPlaceHolder} width={650} height={650}
          alt='product'
          className='border rounded max-w-full'

          />
        </div>
        <div className="flex xl:flex-col items-center xl:gap-5 gap-3 xl:w-36 overflow-auto xl:pb-0 pb-2 max-h-[600px]">
  {variant?.media?.map((thumb) => (
    <Image
      key={thumb._id}
      src={thumb.secure_url || imgPlaceHolder}
      width={120}
      height={120}
      alt="product thumbnail"
      onClick={() => setActiveThumb(thumb.secure_url)}
      className={`md:max-w-full max-w-16 bg-white rounded cursor-pointer ${
        thumb.secure_url === activeThumb
          ? "border-2 border-primary"
          : "border"
      }`}
      
    />
  ))}
</div>

        </div>


        <div className="md:w-1/2 md:mt-0 mt-5">
        <h1 className="text-3xl font-semibold mb-2">{product?.name}</h1>
        <div className="flex items-center gap-1 mb-5">
          {Array.from({ length: 5}).map((_, i) => (
            <IoStar key={i} className="text-yellow-500 w-5 h-5" />
          ))}
          <span className='text-sm ps-2'>{reviewCount} reviews</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className='text-xl font-semibold'>{variant.sellingPrice.toLocaleString('en-IN', {style: 'currency', currency: 'USD'})}</span>
          <span className='text-sm line-through'>{variant.mrp.toLocaleString('en-IN', {style: 'currency', currency: 'USD'})}</span>
          <span className='bg-red-500 rounded-2xl px-3 py-1 text-white text-xs ms-5'>-{variant.discountPercentage}%</span>
        </div>


        <div className="whitespace-pre-line line-clamp-3 text-gray-700">
  {product.description}
</div>

        

    <div className='mt-5 overflow-auto'>
        <p className='mb-2'>
          <span className='font-semibold'>
            Color: {variant?.color || 'N/A'}
          </span>
        </p>
        <div className="flex gap-5 overflow-auto">
          {colors.map( color => (
            <Link onClick={() => setIsProductLoading(true)} href={`${PRODUCT_DETAILS(product.slug)}?color=${color}&size=${variant.size}`} key={color} className={`border py-1 px-3 rounded-lg cursor-pointer hover:bg-primary hover:text-white ${color === variant.color ? 'bg-primary text-white' : ''}`}>
              {color}
            </Link>
          ))}
        </div>
    </div>
    <div className="mt-5 overflow-auto">
  <div className="flex items-center justify-between mb-2">
    <span className="font-semibold">
      Size: {variant?.size || "N/A"}
    </span>

    {/* VIEW SIZE CHART BUTTON */}
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-sm font-medium underline text-primary hover:text-primary/80"
        >
          View Size Chart
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>Size Chart</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Image
            src={chart1}
            alt="Size Chart 1"
            className="w-full h-auto rounded-md"
          />

          <Image
            src={chart2}
            alt="Size Chart 2"
            className="w-full h-auto rounded-md"
          />
        </div>
      </DialogContent>
    </Dialog>
  </div>

        <div className="flex gap-5 overflow-auto">
          {sizes.map( size => (
            <Link onClick={() => setIsProductLoading(true)} href={`${PRODUCT_DETAILS(product.slug)}?color=${variant.color}&size=${size}`} key={size} className={`border py-1 px-3 rounded-lg cursor-pointer hover:bg-primary hover:text-white ${size === variant.size ? 'bg-primary text-white' : ''}`}>
              {size}
            </Link>
          ))}
        </div>
    </div>

    {/* ================= PRODUCT ADDONS ================= */}
{/* ================= PRODUCT ADDONS ================= */}
{addons && addons.length > 0 && (
  <div className="mt-8">
    <h3 className="font-semibold mb-4">Add-ons</h3>

    <div className="space-y-4">
      {addons.map((addon: ProductAddon) => (
        <div key={addon._id} className="border rounded-lg p-4">
          
          <div className="flex justify-between items-center mb-3">
            <p className="font-medium">{addon.label}</p>
            {addon.basePrice > 0 && (
              <span className="text-sm font-semibold">
                +{addon.basePrice.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            )}
          </div>

          {/* CHECKBOX */}
          {addon.type === "checkbox" && (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!selectedAddons[addon.key]}
                onChange={(e) =>
                  setSelectedAddons((prev) => {
                    const updated = { ...prev };
                    if (e.target.checked) {
                      updated[addon.key] = { basePrice: addon.basePrice };
                    } else {
                      delete updated[addon.key];
                    }
                    return updated;
                  })
                }
              />
              <span className="text-sm">Add this option</span>
            </label>
          )}

          {/* SELECT / RADIO */}
          {(addon.type === "select" || addon.type === "radio") &&
            addon.options &&
            addon.options.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                {addon.options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`border rounded px-3 py-2 text-sm ${
                      selectedAddons[addon.key]?.option?.value === opt.value
                        ? "bg-primary text-white"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedAddons((prev) => ({
                        ...prev,
                        [addon.key]: {
                          basePrice: addon.basePrice,
                          option: opt,
                        },
                      }))
                    }
                  >
                    {opt.label}
                    {opt.price > 0 && (
                      <span className="block text-xs">
                        +{opt.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
        </div>
      ))}
    </div>
  </div>
)}


<div className="text-xl font-semibold mt-4">
  Total:
  <span className="ml-2">
    {finalPrice.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    })}
  </span>
</div>



    <div className="mt-5"><p className="font-bold mb-2">Quantity</p>
    <div className="flex items-center h-10 border w-fit rounded-full ">
      <button type='button' className='h-full w-10 flex justify-center items-center cursor-pointer' onClick={()=> {
        handleQty('desc')
      }}>
        <HiMinus /> 
      </button>
      <input type="text" value={qty} className='w-14 text-center border-none outline-none' readOnly/>
      <button type='button' className='h-full w-10 flex justify-center items-center cursor-pointer' onClick={()=> handleQty('inc')}>
        <HiPlus /> 
      </button>
    </div>
    </div>
        

        <div className="mt-5">
          {!isAddedIntoCart ? <ButtonLoading type='button' text='Add to Cart' className='w-full rounded-full py-6 text-md' onClick={handleAddToCart}></ButtonLoading> : 
          <Button className='w-full rounded-full py-6 text-md' type='button' asChild>
            <Link href="/cart">Go to Cart</Link>
          </Button>
          }
        </div>
      </div>
      </div>
      {/* ================= PRODUCT DETAILS ACCORDION ================= */}
<div className="mb-20 bg-[#faf3e8] rounded-lg px-5">
  <AccordionItem
  title="Description"
  content={
    <div className="whitespace-pre-line text-gray-700 leading-relaxed">
      {product.description}
    </div>
  }
/>


  <AccordionItem
    title="Components"
    content={<p>Saree / Lehenga / Blouse (as applicable)</p>}
  />

  <AccordionItem
    title="Disclaimer"
    content={
      <p>
        Product color may slightly vary due to lighting & screen resolution.
        Handcrafted products may have slight irregularities.
      </p>
    }
  />

  <AccordionItem
    title="Shipping & Return"
    content={
      <p>
        Fast dispatch from Surat, India. Worldwide shipping available. Delivered to USA in 7–12 days. Easy
        exchange as per policy.
      </p>
    }
  />

  <AccordionItem
    title="Care Instructions"
    content={<p>Dry clean only. Store in a cool, dry place.</p>}
  />

  <AccordionItem
    title="Help & Manufacturer Information"
    content={
      <div>
        <p>Email: info@acossaenterprise.com</p>
        <p>WhatsApp: +91 96380 00593</p>
      </div>
    }
  />
</div>

{/* ================= WHAT WE OFFER ================= */}
<div className="my-20">
  <h2 className="text-2xl font-semibold mb-8 flex items-center gap-2">
    ✨ What We Offer
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
    {WHAT_WE_OFFER.map((item, i) => (
      <div
        key={i}
        className="bg-gray-50 rounded-lg p-5 text-center hover:shadow-md transition"
      >
        <div className="text-2xl mb-2">{item.icon}</div>
        <h4 className="text-sm font-semibold mb-2">{item.title}</h4>
        <p className="text-xs text-gray-600">{item.desc}</p>
      </div>
    ))}
  </div>
</div>




      <ProductReview productId={product._id} />

      <SimilarProducts
  category={(product as any)?.category}
  productId={product._id}
/>


    </div>

  )
}

export default ProductDetails
