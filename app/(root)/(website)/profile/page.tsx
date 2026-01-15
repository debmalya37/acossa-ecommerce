"use client";

import ButtonLoading from '@/components/Application/LoadingButton'
import UserPanelLayout from '@/components/Application/Website/UserPanelLayout'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea';
import useFetch from '@/hooks/useFetch';
import zodSchema from '@/lib/zodSchema'
import Dropzone from 'react-dropzone'
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import React, { use, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import userIcon from '@/public/assets/images/user.png'
import { FaCamera } from 'react-icons/fa';
import { showToast } from '@/lib/showToast';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '@/store/reducer/authReducer';

const Profile = () => {
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | undefined>(undefined);
    const [file, setFile] = useState<File | undefined>(undefined);
    const dispatch = useDispatch();

    const {data: user} = useFetch('/api/profile/get');

    console.log('user profile data', user);

    const formSchema = zodSchema.pick({
        name: true,
        phone: true,
        address: true,
        email: true,
    })
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            name: '',
            phone: '',
            address: '',
        }
    })

    useEffect(()=> {
        if (user && user.success) {

            const userData = user.data as {
                avatar?: {
                    url: string;
                    public_id: string;
                };
                name?: string;
                phone?: string;
                address?: string;
                email?: string;
            }

            if(!userData) return;
            form.reset({
                name: userData?.name || '',
                phone: userData?.phone || '',
                address: userData?.address || '',
                email: userData?.email || '',
            })
            setPreview(userData?.avatar?.url || undefined);
        }
    }, [user])

    const updateProfile = async (values:any) => {
        setLoading(true);
        try {
            const formData = new FormData();
            if(file) {
                formData.set('file', file)
            }
            formData.set('name', values.name);
            formData.set('phone', values.phone);
            formData.set('address', values.address);


            const {data: response} = await axios.put('api/profile/update', formData)

            if(!response.success) {
                throw new Error(response.message || 'Could not update profile');
            }
            showToast('success', response.message || 'Profile updated successfully');
            dispatch(login(response.data))

        } catch (error:any) {
            showToast('error', error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    const handleFileSelection = (files:any) => {
       const file = files[0];
       const preview = URL.createObjectURL(file);
       setFile(file);
       setPreview(preview);
    }

  return (


    <div className='mt-50'>
        <UserPanelLayout>


        
      <div className="shadow rounded">
        <div className="p-5 text-xl font-semibold border-b">Profile


        </div>

        <div>
        <Form {...(form as any)}>
        <form className="grid md:grid-cols-2 grid-cols-1 gap-5 space-y-8" onSubmit={form.handleSubmit(updateProfile)} >
            <div className="md:col-span-2 col-span-1 flex justify-center items-center">
                <Dropzone onDrop={acceptedFiles => handleFileSelection(acceptedFiles)}>
  {({getRootProps, getInputProps}) => (
    
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <Avatar className='w-28 h-28 relative group border border-gray-100'>
            <AvatarImage src={ preview || userIcon.src} alt="User Icon" />
            <div className="absolute z-50 w-full h-full top-1/2 left-1/2 justify-center items-center -translate-x-1/2 -translate-y-1/2 border-2 border-rose-500 cursor-pointer group-hover:flex hidden rounded-full bg-black/30 ">
            <FaCamera color='oklch(64.5% 0.246 16.439)' size={20} />
            </div>
        </Avatar>
      </div>
    
  )}
</Dropzone>

            </div>
            <div className="mb-3">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input type={"text"} placeholder="Your Name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            </div>
            <div className="mb-3">
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input readOnly type={"text"} placeholder="Your Email" {...field} className='cursor-not-allowed bg-gray-300 text-gray-700' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            </div>
            <div className="mb-3">
                <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="Your Phone" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            </div>
            <div className="mb-3 md:col-span-2 col-span-1">
                <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Your Address" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            </div>
            
            <div className='mb-3 md:col-span-2 col-span-1'>
                <ButtonLoading
                    loading={loading}
                    type="submit"
                    text="Save Changes"
                    className={"cursor-pointer w-full"}
                />
            </div>
            
        </form>
    </Form>
        </div>
      </div>
      </UserPanelLayout>
    </div>
  )
}

export default Profile
