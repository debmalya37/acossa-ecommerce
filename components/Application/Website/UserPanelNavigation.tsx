"use client";

import { Button } from '@/components/ui/button';
import { showToast } from '@/lib/showToast';
import { logout } from '@/store/reducer/authReducer';
import axios from 'axios';
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import React from 'react'
import { useDispatch } from 'react-redux';

const UserPanelNavigation = () => {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const handleLogout = async () => {
        // Implement logout functionality here 
        try {
            const {data: logoutResponse} =await axios.post('/api/auth/logout')
            if(!logoutResponse.success){
                throw new Error(logoutResponse.message || 'Logout failed');
            }
            dispatch(logout())
            showToast('success', logoutResponse.message );
            router.push('/auth/login');
        } catch (error:any) {
            showToast('error', error?.message || 'Logout failed' );
        }
    }
  return (
    <div className='border shadow-sm p-4 rounded'>
      <ul>
        <li className='mb-2'>
            <Link href="/my-account" className={`block p-3 text-sm rounded hover:bg-primary hover:text-white `}>Dashboard</Link>
        </li>
        <li className='mb-2'>
            <Link href="/profile" className={`block p-3 text-sm rounded hover:bg-primary hover:text-white `}>Profile</Link>
        </li>
        <li className='mb-2'>
            <Link href="/orders" className={`block p-3 text-sm rounded hover:bg-primary hover:text-white `}>Orders</Link>
        </li>
        <li className="mb-2">
            <Button type='button'  onClick={handleLogout} variant='destructive' className='w-full'>Logout</Button>
        </li>
      </ul>
    </div>
  )
}

export default UserPanelNavigation
