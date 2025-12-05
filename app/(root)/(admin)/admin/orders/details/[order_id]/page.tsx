"use client";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import ButtonLoading from "@/components/Application/LoadingButton";
import Select from "@/components/Select";
import { showToast } from "@/lib/showToast";
import { orderStatus } from "@/lib/utils";
import { ADMIN_DASHBOARD, ADMIN_ORDERS_SHOW } from "@/routes/AdminPanelRoute";
import { PRODUCT_DETAILS } from "@/routes/WebsiteRoute";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_ORDERS_SHOW, label: "Orders" },
];
const statusOptions = [
  {label: 'pending', value: 'pending'},
  {label: 'processing', value: 'processing'},
  {label: 'shipped', value: 'shipped'},
  {label: 'delivered', value: 'delivered'},
  {label: 'cancelled', value: 'cancelled'},
  {label: 'unverified', value: 'unverified'},
]
const OrderDetails = ({
  params,
}: {
  params: Promise<{ order_id: string }>;
}) => {
  const { order_id } = use(params);

  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/get/${order_id}`
        );
        setOrderData(data);
        setOrderStatus(data?.data?.status);
        console.log("order data:", data);
        console.log("order status:", data?.data?.status);
      } catch {
        setOrderData({ success: false });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [order_id]);

  const handleOrderStatus = async () => {
  try {
    setUpdatingStatus(true);

    const { data: response } = await axios.put(
      "/api/orders/update-status",
      {
        _id: orderData?.data?._id,
        status: orderStatus,
      }
    );

    if (!response.success) {
      showToast("error", response.message);
      return;
    }

    showToast("success", response.message);

    // ✅ RE-FETCH FULL ORDER (IMPORTANT)
    const { data: refreshed } = await axios.get(
      `/api/orders/get/${order_id}`
    );

    setOrderData(refreshed);

  } catch (error: any) {
    showToast("error", error?.message || "Failed to update order status");
  } finally {
    setUpdatingStatus(false);
  }
};




  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        Loading order...
      </div>
    );
  }

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <div className="px-5 my-20 border rounded shadow">
        {orderData && !orderData.success ? (
          <div className="flex justify-center items-center py-32">
            <h4 className="text-red-500 text-xl font-semibold">
              Order not Found
            </h4>
          </div>
        ) : 
        <div className="">
          <div className="p-2 border-b mb-3"><h4 className="text-lg font-bold text-primary">Order Details</h4></div>
        
        <div className="mb-5">
            <p><b>Order Id:</b> {orderData?.data?.order_id}</p>
            <p><b>Transaction Id:</b> {orderData?.data?.payment_id}</p>
            <p className="capitalize">
              <b>Status:</b> {orderData?.data?.status}
            </p>
          </div>

            <table className="w-full border">
                <thead className="border-b bg-primary text-white md:table-header-group hidden">
                    <tr>
                        <th className="text-start p-3">Product</th>
                        <th className="text-center p-3">Price</th>
                        <th className="text-center p-3">Quantity</th>
                        <th className="text-center p-3">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {orderData && orderData?.data?.products?.map((product: any) => (
                        <tr key={product.variantId._id} className="border-b md:table-row flex flex-col mb-5 md:mb-0">
                            <td className="p-3">
                                <div className="flex items-center gap-5">
                                    <Image src={product?.variantId?.media[0]?.secure_url} alt={product.name} width={50} height={50}className="rounded" />
                                    <div>
  <h4 className="text-lg line-clamp-1 font-semibold">
    <Link href={PRODUCT_DETAILS(product?.productId?.slug)}>
      {product?.productId?.name}
    </Link>
  </h4>

  <p className="text-sm">Color: {product?.variantId?.color}</p>
  <p className="text-sm">Size: {product?.variantId?.size}</p>

  {/* ✅ ADDONS */}
  {product?.addons && product.addons.length > 0 && (
    <ul className="mt-2 space-y-1 text-xs text-rose-600">
      {product.addons.map((addon: any) => (
        <li key={addon._id} className="flex justify-between gap-2">
          <span>
            • {addon.label}
            {addon.option?.label && ` (${addon.option.label})`}
          </span>

          <span className="whitespace-nowrap">
            +{addon.totalPrice.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </li>
      ))}
    </ul>
  )}
</div>

                                    
                                </div>
                            </td>

                            <td className="md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center">
                                <span className="md:hidden font-medium">Price</span>
                                <span>{product.sellingPrice.toLocaleString('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                })}</span>
                            </td>
                            <td className="md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center">
                                <span className="md:hidden font-medium">Quantity</span>
                                <span>{product.qty}</span>
                            </td>
                            <td className="md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center">
                                <span className="md:hidden font-medium">Total</span>
                                <span>{(product.sellingPrice * product.qty).toLocaleString('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                })}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>



            </table>


            <div className="grid md:grid-cols-2 grid-cols-1 gap-10 border mt-10">
                <div className="p-5">
                    <h4 className="text-lg font-semibold mb-5">
                    Shipping Address
                    </h4>
                    <div>
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="font-medium py-2">Name</td>
                                    <td className="text-end py-2">{orderData?.data?.name}</td>
                                </tr>
                                <tr>
                                    <td className="font-medium py-2">Email</td>
                                    <td className="text-end py-2">{orderData?.data?.email}</td>
                                </tr>
                                <tr>
                                    <td className="font-medium py-2">Phone</td>
                                    <td className="text-end py-2">{orderData?.data?.phone}</td>
                                </tr>
                                <tr>
                                    <td className="font-medium py-2">Address</td>
                                    <td className="text-end py-2">{orderData?.data?.city},{orderData?.data?.landmark},  {orderData?.data?.pinCode}, {orderData?.data?.state},{orderData?.data?.country}</td>

                                    
                                </tr>
                                <tr>
                                    <td className="font-medium py-2">
                                        {orderData?.data?.orderNote &&
                                        <p className="mt-2"><b>Order Note:</b> {orderData?.data?.orderNote || "N/A"}</p>
                                        }
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="p-5 bg-primary text-white">
                    <h4 className="text-lg font-semibold mb-5">
                    Order Summary
                    </h4>
                    <div>
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="font-medium py-2">Subtotal</td>
                                    <td className="text-end py-2">{orderData?.data?.subtotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                </tr>
                                <tr>
                                    <td className="font-medium py-2">Discount</td>
                                    <td className="text-end py-2">{orderData?.data?.discount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                </tr>
                                <tr>
                                    <td className="font-medium py-2">Coupon Discount Amount:</td>
                                    <td className="text-end py-2">{orderData?.data?.couponDiscountAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                </tr>
                                <tr>
                                    <td className="font-medium py-2">Total</td>
                                    <td className="text-end py-2">{orderData?.data?.totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>

                                    
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <hr />
                    <div className="pt-3">
                      <h4 className="text-lg font-semibold mb-2">Order Status</h4>
                      <Select 
                      options={statusOptions} 
                      selected={orderStatus}
                      setSelected={(value:any)=> setOrderStatus(value)}
                      placeholder="Select"
                      isMulti={false}
                      />
                      <ButtonLoading text="Save Status" type="button" onClick={handleOrderStatus} loading={updatingStatus} className="mt-5 cursor-pointer"/>
                    </div>
                </div>
                
            </div>
        </div>
        }
      </div>
    </div>
  );
};

export default OrderDetails;
