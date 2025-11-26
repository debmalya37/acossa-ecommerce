/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ButtonLoading from '@/components/Application/LoadingButton';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useFetch from '@/hooks/useFetch';
import { showToast } from '@/lib/showToast';
import zodSchema from '@/lib/zodSchema';
import { PRODUCT_DETAILS } from '@/routes/WebsiteRoute';
import { addIntoCart, clearCart } from '@/store/reducer/cartReducer';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { set } from 'mongoose';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { FaShippingFast } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'
import z from 'zod';
import { Textarea } from '@/components/ui/textarea';

interface VerifiedCartItem {
  variantId: string;
  name: string;
  media: string;
  url: string;
  color: string;
  size: string;
  qty: number;
  mrp: number;
  sellingPrice: number;
}

interface VerifiedCartResponse {
  success: boolean;
  data: VerifiedCartItem[];
}


const CheckoutPage = () => {
  const cart = useSelector((store:any) => store.cartStore);
  const auth = useSelector((store:any) => store.authStore);
  const dispatch = useDispatch();
const [verifiedCartData, setVerifiedCartData] = useState<VerifiedCartItem[]>([]);

  const { data: getVerifiedCartData, loading } = useFetch<VerifiedCartResponse>(
  "/api/cart-verification",
  "POST",
  { data: cart.products }
);


  const [isCouponApplied, setIsCouponApplied] = React.useState(false);
  const [Subtotal, setSubtotal] = useState(0);
  const [Discount, setDiscount] = useState(0);
 const [couponLoading, setCouponLoading] = useState(false);
 const [couponDiscountAmount, setCouponDiscountAmount] = useState(0);
 const [totalAmount, setTotalAmount] = useState(0);
 const [couponCode, setCouponCode] = useState('');
 const [placingOrder, setPlacingOrder] = useState(false);


  console.log("verifiedCartData", getVerifiedCartData);

  useEffect(() => {
  if (getVerifiedCartData?.success && Array.isArray(getVerifiedCartData.data)) {
    const cartItems = getVerifiedCartData.data; // this is VerifiedCartItem[]

    setVerifiedCartData(cartItems); // ✓ now correct

    dispatch(clearCart([]));

    cartItems.forEach((item) => {
      dispatch(addIntoCart(item));
    });
  }
}, [getVerifiedCartData, dispatch]);




  useEffect(()=> {
          const cartProducts = cart.products;
          const subtotalAmount = cartProducts.reduce((total: number, product: any) => {
              return total + (product.sellingPrice * product.qty);
          }, 0);
          const discount = cartProducts.reduce((total: number, product: any) => {
              return total + ((product.mrp - product.sellingPrice) * product.qty);
          }, 0);
          setSubtotal(subtotalAmount);
          setDiscount(discount);
          setTotalAmount(subtotalAmount);
          couponForm.setValue("minShoppingAmount", subtotalAmount);
      }, [cart])
  // coupon form  

  const couponFormSchema = zodSchema.pick({
    code: true,
    minShoppingAmount: true,
  })


  const couponForm = useForm({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: '',
      minShoppingAmount: Subtotal,
    }

  })

  const applyCoupon =  async (values: { code: string; minShoppingAmount: number }) => {
    setCouponLoading(true);
    try {
      const {data: response} = await axios.post ('/api/coupon/apply', values);
      if(!response.success) {throw new Error(response.message);}

      showToast("success", "Coupon applied successfully.");
      const discountPercentage = response.data.discountPercentage;
      // get coupon discount amount
      setCouponDiscountAmount((Subtotal * discountPercentage) / 100);
      setTotalAmount(Subtotal - ((Subtotal * discountPercentage) / 100));
      setCouponCode(couponForm.getValues("code"));
      setIsCouponApplied(true);
      couponForm.resetField("code", {defaultValue: ''});

    } catch (error) {
      showToast("error", "Failed to apply coupon. Please try again.");

    }finally {
      setCouponLoading(false);
    }
  }

  const removeCoupon = ()=> {
    setIsCouponApplied(false);
    setCouponDiscountAmount(0);
    setTotalAmount(Subtotal);
    setCouponCode('');
  }

  // console.log("coupon code applied:", couponForm.formState.errors );


  // place order handler
  const OrderFormSchema = zodSchema.pick({
    name: true,
    email: true,
    phone: true,
    country: true,
    state: true,
    city: true,
    pinCode: true,
    landmark: true,
    orderNote: true,
  }).extend({
    userId: z.string().optional(),
  })


  const OrderForm = useForm({
    resolver: zodResolver(OrderFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      country: '',
      state: '',
      city: '',
      pinCode: '',
      landmark: '',
      orderNote: '',
      userId: auth?._id,
    }

  })

const placeOrder = async (formData:any) => {
  console.log("placing order form data:", formData)
  setPlacingOrder(true);
  try {
    
  } catch (error: any) {
    showToast("error", error.message || "Failed to place order. Please try again.");
  }finally {
    setPlacingOrder(false);
  }
}



  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center text-xl">
        Verifying Cart...
      </div>
    );
  }

  return (
    <div>
      {cart.count === 0 ? (
        <div className='w-screen flex justify-center items-center py-32'>
          <div className="text-center">
            <h4 className='text-4xl font-semibold mb-5'>Your cart is empty</h4>
            <Button type="button" asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className='flex lg:flex-nowrap flex-wrap gap-10 my-20 lg:px-32 mt-60'>
          <div className="lg:w-[60%] w-full">
            <div className="flex gap-2 items-center font-semibold">
              <FaShippingFast size={25}/>
            </div>

            <div className='mt-5'>
              <Form {...OrderForm}>
                    <form className='grid grid-cols-2 gap-5'  onSubmit={OrderForm.handleSubmit(placeOrder)}>
                      <div className='mb-3'>
                        <FormField
                        control={OrderForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder='Full Name*' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                        >

                        </FormField>
                      </div>
                      <div className='mb-3'>
                        <FormField
                        control={OrderForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type='email' placeholder='Email*' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                        >

                        </FormField>
                      </div>
                      <div className='mb-3'>
                        <FormField
                        control={OrderForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type='tel' placeholder='Phone*' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                        >

                        </FormField>
                      </div>
                      <div className='mb-3'>
                        <FormField
                        control={OrderForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder='Country*' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                        >

                        </FormField>
                      </div>
                      <div className='mb-3'>
                        <FormField
                        control={OrderForm.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder='State*' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                        >

                        </FormField>
                      </div>
                      <div className='mb-3'>
                        <FormField
                        control={OrderForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder='City*' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                        >

                        </FormField>
                      </div>
                      <div className='mb-3'>
                        <FormField
                        control={OrderForm.control}
                        name="pinCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type='number' placeholder='Pin Code*' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                        >

                        </FormField>
                      </div>
                      <div className='mb-3'>
                        <FormField
                        control={OrderForm.control}
                        name="landmark"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder='Landmark*' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                        >

                        </FormField>
                      </div>
                      <div className='mb-3 col-span-2'>
                        <FormField
                        control={OrderForm.control}
                        name="orderNote"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea placeholder='Enter order note' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                        >

                        </FormField>
                      </div>

                        <div className="mb-3">
                          <ButtonLoading loading={placingOrder} type='submit' text='Place Order' className='bg-black rounded-full px-5 cursor-pointer' />
                           
                        </div>
                      
                    </form>
                  </Form>
            </div>
          </div>

          <div className="lg:w-[40%] w-full">
            <div className="rounded bg-gray-50 p-5 sticky top-5">
              <h4 className="text-lg font-semibold mb-5">Order Summary</h4>
              <div>
                <table className='w-full border'>

                <tbody>
                  {verifiedCartData && verifiedCartData?.map(product => (
                    <tr key={product.variantId}>
                      <td className='py-2'>
                        <div className="flex items-center gap-5">
                          <Image 
                          src={product.media}
                          width={60}
                          height={60}
                          alt={product.name}
                          className='rounded'
                          />
                          <div>
                            <h4 className='font-medium line-clamp-1'><Link href={PRODUCT_DETAILS(product.url)}>{product.name}</Link> </h4>
                            <p>Color: {product.color}</p>
                            <p>Size: {product.size}</p>
                          </div>
                        </div>
                      </td>
                      <td className='p-3 text-center'>
                    <p className="text-nowrap text-sm">
                      {product.qty} X {product.sellingPrice.toLocaleString('en-US',
                        { style: 'currency', currency: 'USD' }
                      )}
                    </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
                </table>
                <table className='w-full'>
                  <tbody>
                    <tr>
                      <td className='font-medium py-2'>Subtotal</td>
                      <td className='text-end py-2'>
                        {Subtotal.toLocaleString('en-US',
                          { style: 'currency', currency: 'USD' }
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className='font-medium py-2'>Discount</td>
                      <td className='text-end py-2'>
                        {Discount.toLocaleString('en-US',
                          { style: 'currency', currency: 'USD' }
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className='font-medium py-2'>Coupon Discount</td>
                      <td className='text-end py-2'>
                        {couponDiscountAmount.toLocaleString('en-US',
                          { style: 'currency', currency: 'USD' }
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className='font-medium py-2 text-xl'>Total</td>
                      <td className='text-end py-2'>
                        {totalAmount.toLocaleString('en-US',
                          { style: 'currency', currency: 'USD' }
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-2 mb-5">
                  {!isCouponApplied ? 
                  <Form {...couponForm}>
                    <form className='flex justify-between gap-5' onSubmit={couponForm.handleSubmit(applyCoupon)}>
                      <div className='w-[calc(100%-100px)]'>
                        <FormField
                        control={couponForm.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder='Coupon Code' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                        >

                        </FormField>
                      </div>

                      <div className="w-[100px]">
                        <ButtonLoading type='submit' text='apply' className='w-full cursor-pointer' loading={couponLoading}>

                        </ButtonLoading>
                      </div>
                    </form>
                  </Form>
                  :
                  <div className='flex justify-between py-1 px-5 rounded-lg bg-gray-200'>
                    <div>
                      <span className="text-xs">Coupon: </span>
                      <p className='text-sm font-semibold'>{couponCode}</p>
                    </div>
                    <Button type='button' className='text-red-50 cursor-pointer' onClick={removeCoupon} >
                        <IoCloseCircleOutline />
                    </Button>
                  </div>
                }

                </div>

                <Button
                  type='button'
                  className='w-full bg-black rounded-full mt-5 mb-3'
                  asChild
                >
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>

                <p className='text-center'>
                  <Link href="/shop">Continue Shopping</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;
