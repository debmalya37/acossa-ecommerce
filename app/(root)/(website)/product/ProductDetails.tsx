/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
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

interface ProductDetailsProps {
  product: Product;
  variant: Variant;
  colors: string[];
  sizes: string[];
  reviewCount: number;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({product, variant, colors, sizes, reviewCount,}) => {
    const {slug}= useParams<{ slug: string }>();
    const [activeThumb, setActiveThumb] = useState<string | undefined>();
    const [qty, setQty] = useState<number>(1);
    const [isAddedIntoCart, setIsAddedIntoCart] = useState<boolean>(false);

    const [isProductLoading, setIsProductLoading] = useState<boolean>(false);


    const  dispatch = useDispatch();
    const cartStore = useSelector((store: any) => store.cartStore);

    console.log("here is the product", product)
    console.log("here is the variant", variant)


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

    const handleAddToCart = () => {
      // Add to cart functionality here
      const cartProduct = {
        productId: product._id,
        variantId: variant._id,
        name: product.name,
        color: variant.color,
        size: variant.size,
        mrp: variant.mrp,
        sellingPrice: variant.sellingPrice,
        media: variant?.media[0]?.secure_url,
        qty: qty,
      }

      dispatch(addIntoCart(cartProduct));
      setIsAddedIntoCart(true);
      showToast('success', 'Product added to cart successfully');
      console.log("Adding to cart:", cartProduct);
    }

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


        <div className='line-clamp-3' dangerouslySetInnerHTML={{__html: decode(product.description)}}></div>
        

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
    <div className='mt-5 overflow-auto'>
        <p className='mb-2'>
          <span className='font-semibold'>
            Size: {variant?.size || 'N/A'}
          </span>
        </p>
        <div className="flex gap-5 overflow-auto">
          {sizes.map( size => (
            <Link onClick={() => setIsProductLoading(true)} href={`${PRODUCT_DETAILS(product.slug)}?color=${variant.color}&size=${size}`} key={size} className={`border py-1 px-3 rounded-lg cursor-pointer hover:bg-primary hover:text-white ${size === variant.size ? 'bg-primary text-white' : ''}`}>
              {size}
            </Link>
          ))}
        </div>
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


      <div className="mb-20">
        <div className="shadow rounded border">
          <div className='p-3 bg-gray-50 border-b'>
            <h2 className='font-semibold'>Product Description</h2>
          </div>
          <div className='p-3'>

          <div dangerouslySetInnerHTML={{__html: decode(product.description)}}></div>
          </div>
        </div>
      </div>

      <ProductReview productId={product._id} />

    </div>

  )
}

export default ProductDetails
