/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react'
import { BsCart2 } from 'react-icons/bs';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp';
import { useDispatch } from 'react-redux';
import { removeFromCart } from '@/store/reducer/cartReducer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StethoscopeIcon } from 'lucide-react';

const CartPage = () => {
    const cart = useSelector((store:any) => store.cartStore);
    const [open, SetOpen] = useState(false);
    const [subtotal, setSubtotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const dispatch = useDispatch();


    const getAddonTotal = (addons: any[] = []) =>
  addons.reduce((sum, addon) => {
    let price = addon.basePrice || 0;
    if (addon.option) {
      price += addon.option.price || 0;
    }
    return sum + price;
  }, 0);

const getProductTotal = (product: any) =>
  (product.sellingPrice * product.qty) + getAddonTotal(product.addons);


useEffect(() => {
  const cartProducts = cart.products;

  const subtotalAmount = cartProducts.reduce(
    (total: number, product: any) =>
      total + getProductTotal(product),
    0
  );

  const discountAmount = cartProducts.reduce(
    (total: number, product: any) =>
      total +
      ((product.mrp - product.sellingPrice) * product.qty),
    0
  );

  setSubtotal(subtotalAmount);
  setDiscount(discountAmount);
}, [cart]);

    return (
        <Sheet open={open} onOpenChange={SetOpen}>
            <SheetTrigger className='relative'>
                <BsCart2 className='text-gray-500 hover:text-primary' />
                <span className='absolute bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center -right-2 -top-1'>{cart.count}</span>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader className='py-2'>
                    <SheetTitle className='text-2xl'>My Cart</SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>

                <div className="h-[calc(100%-128px)] overflow-auto px-2">
                    {cart.count === 0 && (
                        <div className='h-full flex justify-center items-center text-xl font-semibold'>
                            Your cart is empty
                        </div>
                    )}

                    {cart.products.map((product:any) => (
                        <div key={product.variantId} className="flex justify-between items-center gap-5 mb-4 border-b pb-4">
                            <div className="flex gap-5 items-center">
                                <Image
                                    src={product?.media|| imgPlaceholder}
                                    alt={product.name}
                                    width={100}
                                    height={100}
                                    className='w-20 h-20 rounded border'
                                />


                                <div>
                                    <h4 className='text-lg mb-1'>{product.name}</h4>
                                    <p className='text-gray-500' >{product.size}/{product.color}</p>
                                </div>
                            </div>

                            <div >
                                <button type='button' 
                                className='text-red-500 underline underline-offset-1 mb-2 cursor-pointer'
                                onClick={() => dispatch(removeFromCart({productId: product.productId, variantId: product.variantId}))}
                                >
                                    Remove
                                </button>
                                
                                <div className="space-y-1">
  <p className="font-semibold">
    {product.qty} ×{" "}
    {product.sellingPrice.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    })}
  </p>

  {/* ADDONS */}
  {product.addons?.length > 0 && (
    <div className="text-sm text-gray-600 space-y-1">
      {product.addons.map((addon: any) => {
        const addonPrice =
          addon.basePrice +
          (addon.option?.price || 0);

        return (
          <div
            key={addon.key}
            className="flex justify-between"
          >
            <span>
              + {addon.key.replace(/_/g, " ")}
              {addon.option?.label && ` (${addon.option.label})`}
            </span>
            <span>
              {addonPrice.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </span>
          </div>
        );
      })}
    </div>
  )}

  <p className="font-semibold text-primary pt-1">
    Item Total:{" "}
    {getProductTotal(product).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    })}
  </p>
</div>

                            </div>
                        </div>
                    ))}
                </div>

                <div className="h-32 border-t pt-2 px-2 mb-4">
                    <h2 className='flex justify-between items-center text-lg font-semibold'>
                        <span>
                            Subtotal:
                        </span>
                        <span>{subtotal.toLocaleString('en-US',
                            { style: 'currency', currency: 'USD' }
                        )}</span>
                    </h2>
                    <h2 className='flex justify-between items-center text-lg font-semibold'>
                        <span>
                            Discount:
                        </span>
                        <span>{discount.toLocaleString('en-US',
                            { style: 'currency', currency: 'USD' }
                        )}</span>
                    </h2>

                    <div className="flex justify-between gap-5 mt-3">
                        <Button type='button' asChild           variant="secondary" className='w-[200px]' onClick={()=> SetOpen(false)} >
                        <Link href="/cart">View Cart</Link>
                        </Button>
                        <Button type='button' asChild className='w-[200px]' onClick={()=> SetOpen(false)} >

                        {cart.count ? <Link href="/checkout">Checkout</Link> : <span className="text-gray-500 cursor-not-allowed">Empty Cart</span>}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default CartPage;
