"use client";
import Loading from '@/components/Application/Loading';
import UserPanelLayout from '@/components/Application/Website/UserPanelLayout';
import useFetch from '@/hooks/useFetch';
import { WEBSITE_ORDER_DETAILS } from '@/routes/WebsiteRoute';
import Link from 'next/link';
import React from 'react'


interface UserOrdersAPI {
  Orders: any[];
}


const Orders = () => {

  const {data: OrderData, loading} = useFetch<UserOrdersAPI>('/api/user-order');

  console.log('Orders:', OrderData);

  // if(loading) {
  //   return <div className='mt-50'><Loading /></div>
  // }

  return (
    <div className='mt-50'>
      <UserPanelLayout>

      
    <div className='shadow rounded '>
                <div className="p-5 text-xl font-semibold border">
                    Orders
                </div>
                <div className="p-5">

                  {loading ? <Loading />
                   :
                   <div className="overflow-auto mb-5">
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
                      {OrderData?.data?.Orders?.map((order, i) => ( //todo: check if before production on localhost once if its running ok
                        <tr key={order._id}>
                          <td className="text-start text-sm p-2 text-gray-500 font-bold">{i + 1}</td>
                          <td className="text-start text-sm p-2 text-gray-500 font-bold"><Link href={WEBSITE_ORDER_DETAILS(order.order_id)}>{order.order_id}</Link></td>
                          <td className="text-start text-sm p-2 text-gray-500 font-bold">{order.products.length}</td>
                          <td className="text-start text-sm p-2 text-gray-500 font-bold">{order.totalAmount.toLocaleString('en-US', {
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
                  
                  }
                  
                
                </div>
            </div>
            </UserPanelLayout>
    </div>
  )
}

export default Orders
