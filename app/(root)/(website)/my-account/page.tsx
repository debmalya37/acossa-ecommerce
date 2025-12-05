"use client";

import UserPanelLayout from '@/components/Application/Website/UserPanelLayout'
import useFetch from '@/hooks/useFetch';
import { WEBSITE_ORDER_DETAILS } from '@/routes/WebsiteRoute';
import Link from 'next/link';
import React from 'react'
import { HiOutlineShoppingBag } from 'react-icons/hi'
import { IoCartOutline } from 'react-icons/io5'
import { useSelector } from 'react-redux';
import { tr } from 'zod/v4/locales';
const breadcrumbDarta = {
    title: 'Dashboard',
    links: [{label: 'Dashboard', href: '/my-account'}]
}

interface DashboardData {
  totalOrder: number;
  recentOrders: any[];
}

const MyAccount = () => {

  const {data:  dashboardData} = useFetch<DashboardData>('/api/dashboard/user');
  console.log('dashboardData:', dashboardData);
  const cartStore = useSelector((store:any) => store.cartStore);

  console.log('cartStore:', cartStore);

  return (
    <div className='mt-50'>
      <UserPanelLayout>
        <div className='shadow rounded'>
            <div className="p-5 text-xl font-semibold border">
                Dashboard
            </div>
            <div className="p-5">

            
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-10">
        <div className="flex item-center justify-between gap-5 border rounded p-3">
              <div>
                <h4 className="font-semibold text-lg mb-1">
                  total orders
                </h4>
                <span className='font-semibold text-gray-500'>{dashboardData?.data?.totalOrder || 0}</span>
                </div>

              
                <div className='w-16 h-16 bg-primary rounded-full flex
                justify-center items-center'>
                  <HiOutlineShoppingBag className='text-white' size={25} />
                </div>
                </div>
        <div className="flex item-center justify-between gap-5 border rounded p-3">
              <div>
                <h4 className="font-semibold text-lg mb-1">
                  Items in cart
                </h4>
                <span className='font-semibold text-gray-500'>{cartStore.products.length}</span>
                </div>

              
                <div className='w-16 h-16 bg-primary rounded-full flex
                justify-center items-center'>
                  <IoCartOutline className='text-white' size={25} />
                </div>
                </div>
            </div>

            <div className="mt-5 mx-2">
              <h4 className='text-lg font-semibold mb-3'>Recent Orders</h4>
              <div className="overflow-auto">
              <table className='w-full'>
                <thead>
                  <tr>
                    <th className='text-start p-2 text-sm border-b text-nowrap text-gray-500'>Sr. No.</th>
                    <th className='text-start p-2 text-sm border-b text-nowrap text-gray-500'>Order ID</th>
                    <th className='text-start p-2 text-sm border-b text-nowrap text-gray-500'>Total Items</th>
                    <th className='text-start p-2 text-sm border-b text-nowrap text-gray-500'>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData && dashboardData?.data?.recentOrders?.map((order, i)=> (
                    <tr key={order._id}>
                      <td className="text-start text-sm p-2 text-gray-500 font-bold">{i + 1}</td>
                      <td className="text-start text-sm p-2 text-gray-500 font-bold"><Link href={WEBSITE_ORDER_DETAILS(order.order_id)}>{order.order_id}</Link></td>
                      <td className="text-start text-sm p-2 text-gray-500 font-bold">{order.products.length}</td>
                      <td className="text-start text-sm p-2 text-gray-500 font-bold">${order.totalAmount.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
            </div>
        </div>
      </UserPanelLayout>
    </div>
  )
}

export default MyAccount
