"use client";

import { PRODUCT_DETAILS } from "@/routes/WebsiteRoute";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import OrderInvoicePDF from "@/components/Application/Invoice/OrderInvoicePDF";
import { showToast } from "@/lib/showToast";

const OrderDetails = ({
  params,
}: {
  params: Promise<{ orderid: string }>;
}) => {
  const { orderid } = use(params);

  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/get/${orderid}`
        );
        setOrderData(data);
        console.log("order data:", data);
      } catch {
        setOrderData({ success: false });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderid]);


  const downloadInvoice = async () => {
  try {
    const blob = await pdf(<OrderInvoicePDF order={orderData.data} />).toBlob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice-${orderData.data.order_id}.pdf`;
    a.click();

    URL.revokeObjectURL(url);
  } catch (error: any) {
    showToast("error", error.message || "Failed to generate invoice");
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
    <div className="mt-50">
      <div className="lg:px-32 px-5 my-20">
        {orderData && !orderData.success ? (
          <div className="flex justify-center items-center py-32">
            <h4 className="text-red-500 text-xl font-semibold">
              Order not Found
            </h4>
          </div>
        ) : 
        <div>

        
        <div className="mb-5">
            <p><b>Order Id:</b> {orderData?.data?.order_id}</p>
            <p><b>Transaction Id:</b> {orderData?.data?.payment_id}</p>
            <p className="capitalize">
              <b>Status:</b> {orderData?.data?.status}
            </p>
          </div>

          <button
  onClick={downloadInvoice}
  className="bg-green-600 text-white px-4 py-2 rounded mt-4"
>
  Download Invoice
</button>


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
                                    <Image src={product?.variantId?.media[0]?.secure_url} alt={product.name} width={50} height={50} className="rounded" />
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
    <ul className="mt-2 space-y-1 text-xs text-gray-600">
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
                </div>
                
            </div>
        </div>
        }
      </div>
    </div>
  );
};

export default OrderDetails;
