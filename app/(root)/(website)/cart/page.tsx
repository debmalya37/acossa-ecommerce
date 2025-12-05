/* eslint-disable @typescript-eslint/no-explicit-any */


"use client";

import React, { useEffect, useState } from 'react'
import { BsCart2 } from 'react-icons/bs';

import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PRODUCT_DETAILS } from '@/routes/WebsiteRoute';
import { HiMinus, HiPlus } from 'react-icons/hi';
// import { useDispatch } from 'react-redux';
import { decreaseQuantity, increaseQuantity, removeFromCart } from '@/store/reducer/cartReducer';
import { IoCloseCircleOutline } from 'react-icons/io5';


const breadCrumb = {
    title: "Cart",
    links: [
        {label: "Cart"}
    ]
}
const CartPage = () => {
    const cart = useSelector((store: any) => store.cartStore);
    const [subtotal, setSubtotal] = useState(0);
    const [discount, setDiscount] = useState(0);

    const dispatch = useDispatch();


    useEffect(()=> {
        const cartProducts = cart.products;
        const totalAmount = cartProducts.reduce((total:any, product:any) => {
  return total + (product.finalPrice ?? 0);
}, 0);

        const discount = cartProducts.reduce((total:any, product:any) => {
            return total + ((product.mrp - product.sellingPrice) * product.qty);
        }, 0);
        setSubtotal(totalAmount);
        setDiscount(discount);
    }, [cart])
    return (
        <div className='mt-50'>
            {cart.count === 0 
            ? 
            <div className='w-screen flex justify-center items-center py-32'>
                <div className="text-center">
                    <h4 className='text-4xl font-semibold mb-5'>Your cart is empty</h4>
                    <Button type="button" asChild>
                    <Link href="/shop">Continue Shopping</Link>
                    </Button>
                </div>
                
            </div> :
            <div className='flex lg:flex-nowrap flex-wrap gap-10 my-20 lg:px-32 mt-60'>

                <div className="lg:w-[70%] w-full">
                <table className='w-full border'>
                    <thead className='border-b bg-gray-50 md:table-header-group hidden'>
                        <tr>
                            <th className="text-start p-3">Produt</th>
                            <th className="text-start p-3">Price</th>
                            <th className="text-start p-3">Quantity</th>
                            <th className="text-start p-3">Total</th>
                            <th className="text-start p-3"></th>
                        </tr>
                    </thead>

                    <tbody>
                          {
                            cart.products.map((product: any) => (
                                <tr key={product.variantId} className='md:table-row block border-b'>
                                    <td className='p-3'>
                                        <div className='flex items-center gap-5'>
                                            <Image
                                            src={product.media || imgPlaceholder.src}
                                            alt={product.name}
                                            width={60}
                                            height={60}
                                            />
                                            <div>
                                                <h4 className='text-lg font-medium line-clamp-1'><Link href={PRODUCT_DETAILS(product.url)}>{product.name}</Link></h4>
                                                <p className='text-sm' >Color: {product.color}  </p>
                                                <p className='text-sm' >Size: {product.size}  </p>
                                            </div>
                                            {product.addons && product.addons.length > 0 && (
  <div className="text-xs text-gray-600 mt-1 space-y-1">
    {product.addons.map((addon: any, i: number) => (
      <p key={i}>
        • {addon.key}
        {addon.option?.label ? ` (${addon.option.label})` : ""}
      </p>
    ))}
  </div>
)}

                                        </div>
                                    </td>

                                    <td  className='md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center'>
                                        <span className='md:hidden font-medium' >Price</span>
                                        <span>
                                            {product.sellingPrice.toLocaleString('en-US',
                                            { style: 'currency', currency: 'USD' }
                                        )}
                                        </span>
                                        
                                    </td>
                                    <td  className='md:table-cell flex justify-between md:p-3 px-3 pb-2'>
                                        <span className='md:hidden font-medium' >Quantity</span>
                                        <div className='flex justify-center'>
                                        <div className="flex justify-center items-center md:h-10 h-7 border w-fit rounded-full ">
                                              <button type='button' className='h-full w-10 flex justify-center items-center cursor-pointer' onClick={()=> dispatch(decreaseQuantity({productId: product.productId, variantId: product.variantId}))}>
                                                <HiMinus /> 
                                              </button>
                                              <input type="text" value={product.qty} className='md:w-14  w-8 text-center border-none outline-none' readOnly/>
                                              <button type='button' className='h-full w-10 flex justify-center items-center cursor-pointer' onClick={()=> dispatch(increaseQuantity({productId: product.productId, variantId: product.variantId}))}>
                                                <HiPlus /> 
                                              </button>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center'>
                                        <span className='md:hidden font-medium' >Total</span>
                                        <span>
                                            {product.finalPrice.toLocaleString('en-US',
                                            { style: 'currency', currency: 'USD' }
                                        )}
                                        </span>
                                    </td>
                                    <td className='md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center'>
                                        <span className='md:hidden font-medium' >Remove</span>
                                              <button type='button' onClick={()=> 
                                                dispatch(removeFromCart({productId: product.productId, variantId: product.variantId}))
                                              }>
                                                <IoCloseCircleOutline />
                                              </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
                </div>

                <div className="lg:w-[30%] w-full">
                    <div className="rounded bg-gray-50 p-5 sticky top-5">
                        <h4 className="text-lg font-semibold mb-5">Order Summary</h4>
                        <div>
                            <table className='w-full'>
                                <tbody>
                                    <tr>
                                        <td className='font-medium py-2'>Subtotal</td>
                                        <td className='text-end py-2'>
                                            {subtotal.toLocaleString('en-US',
                                                { style: 'currency', currency: 'USD' }
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='font-medium py-2'>Discount</td>
                                        <td className='text-end py-2'>
                                            -{discount.toLocaleString('en-US',
                                                { style: 'currency', currency: 'USD' }
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='font-medium py-2'>Total</td>
                                        <td className='text-end py-2'>
                                            {subtotal.toLocaleString('en-US',
                                                { style: 'currency', currency: 'USD' }
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <Button type='button' className='w-full bg-black rounded-full mt-5 mb-3' asChild ><Link href="/checkout">Proceed to Checkout</Link></Button>

                            <p className='text-center'>
                                <Link href="/shop">Continue Shopping</Link>
                            </p>
                        </div>
                    </div>
                </div>

            </div>
            }
        </div>
    );
}

export default CartPage;
