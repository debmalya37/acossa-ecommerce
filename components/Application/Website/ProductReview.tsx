/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import React, { use, useEffect, useState } from 'react'
import { IoStar } from 'react-icons/io5'
import ButtonLoading from '../LoadingButton'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import zodSchema from '@/lib/zodSchema';
import { useSelector } from 'react-redux';
import { Rating } from '@mui/material';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { showToast } from '@/lib/showToast';
import Link from 'next/link';
import { is } from 'zod/v4/locales';
import { get } from 'http';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import ReviewList from './ReviewList';
import useFetch from '@/hooks/useFetch';

const ProductReview = ({productId}: {productId: string}) => {
        const auth = useSelector((store:any) => store.authStore.auth);
        const [currentUrl, setCurrentUrl] = useState("");
        const queryClient = useQueryClient();

const [reviewCount, setReviewCount] = useState<any>({
  averageRating: 0,
  totalReview: 0,
  percentage: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  rating: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
});

    const [loading, setLoading] = useState<boolean>(false);
    const [isReview, setIsReview] = useState(false);
    const formSchema = zodSchema.pick({
        product: true,
        userId: true,
        rating: true,
        review: true,
        title: true,
        
    })

    const {data: reviewDetails} = useFetch(`/api/review/details?productId=${productId}`);


    useEffect(() => {
  if (reviewDetails?.success) {
    setReviewCount(reviewDetails.data);
  }
}, [reviewDetails]);

    console.log("review details", reviewDetails);



      const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          product: productId || "",
          userId: auth?._id || "",
          rating: 0,
          review: "",
          title: "",
          
        },
      });

      useEffect(() => {
        form.setValue("userId", auth?._id || "");
      }, [auth]);

      useEffect(() => {
        if (typeof window !== "undefined") {
          setCurrentUrl(window.location.href);
        }
      }, []);


      const handleReviewSubmit = async (values:any) => {
            setLoading(true);
            
                try {
                  const { data: response } = await axios.post("/api/review/create", values);
            
                  if (!response.success) {
                    throw new Error(response.message);
                  }
            
                  form.reset();
                  showToast("success", response.message);
                  queryClient.invalidateQueries({ queryKey: ['product-review'] });
                  console.log("Review submitted successfully", response);
                } catch (error: any) {
                  showToast("error", error.message);
                } finally {
                  setLoading(false);
                }
      }

     const fetchReview = async (pageParam:any) => {
  try {
    const { data: getReviewData } = await axios.get(
      `/api/review/get?productId=${productId}&page=${pageParam}`
    );

    if (!getReviewData?.success) {
      return {
        reviews: [],
        nextPage: undefined,
        totalReviews: 0,
      };
    }

    // Always return a valid object
    return {
      reviews: getReviewData.data.reviews,
      nextPage: getReviewData.data.nextPage,
      totalReviews: getReviewData.data.totalReviews,
    };
  } catch (error:any) {
    showToast("error", error.message);

    return {
      reviews: [],
      nextPage: undefined,
      totalReviews: 0,
    };
  }
};

     const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetching,
} = useInfiniteQuery({
  queryKey: ["product-review", productId],
  queryFn: ({ pageParam }) => fetchReview(pageParam),
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
});


console.log("review data", data);
  return (
    
        <div className="shadow rounded border mb-20">
          <div className='p-3 bg-gray-50 border-b'>
            <h2 className='font-semibold'>Rating & Reviews</h2>
          </div>
          <div className='p-5'>

          <div className="flex justify-between flex-wrap items-center">
            <div className="md:w-1/2 w-full md:flex md:gap-10 md:mb-0 mb-5">
            <div className='md:w-[200px] w-full md:mb-0 mb-5'>
                <h4 className='text-center text-8xl font-semibold'>{reviewCount?.averageRating}</h4>
                <div className="flex justify-center gap-2">
                    <IoStar />
                    <IoStar />
                    <IoStar />
                    <IoStar />
                    <IoStar />
                </div>
                <p className='text-center mt-3'> ({reviewCount?.totalReview} Rating & Reviews)</p>
            </div>

            <div className='md:w-[calc(100%-200px)] flex items-center'>
            <div className="w-full">
                {[5,4,3,2,1].map(rating => (
                        <div key={rating} className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                            <p className='w-3'>{rating}</p>
                            <IoStar/>
                        </div>
                        <Progress value={reviewCount?.percentage[rating]} />
                        <span className='text-sm'>{reviewCount?.rating[rating] || 0}</span>
                    </div>
                ))  }



                </div>
            </div>
            </div>


                <div className='md:w-1/2 w-full md:text-end text-center'>
                    <Button onClick={()=> setIsReview(!isReview)} variant="outline" type='button' className='md:w-fit w-full py-6 px-10'>
                        Write Review

                    </Button>
                </div>

          </div>


    {isReview && 
    <div className='my-5'>
            <hr className="mb-5"/>
            {!auth ? 
            <>
            <p className='mb-2'>Please <strong>login</strong> to write a review.</p>
            
            <Button>
                
                <Link href={`auth/login?callback=${encodeURIComponent(currentUrl)}`}>Login</Link>
                
                </Button>
            </>
            :
            <>
            <h4 className='text-xl font-semibold'>Write a Review</h4>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleReviewSubmit)} className="space-y-8">

            <div className="mb-5">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="rating"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormControl>
                        <Rating
                        value={field.value}
                        size='large'
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-5">
              {/* Slug Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Review title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-5">
              {/* Slug Field */}
              <FormField
                control={form.control}
                name="review"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your review here..."
                        {...field}

                        >
                      </Textarea>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
              {/* Submit Button */}
              <div className="mb-3">
                <ButtonLoading
                  loading={loading}
                  type="submit"
                  text="Submit Review"
                  className="cursor-pointer"
                />
              </div>
            </form>
          </Form>
            </>    
        }

            
    </div>
    }
        <div className="mt-10 border-t pt-5">
            <h5 className='text-xl font-semibold'>{data?.pages[0]?.totalReviews || 0 } Reviews</h5>
            <div className="mt-10">
                {data && data.pages.map((page:any) => (
                    page.reviews.map((review:any) => (
                        <div className="mb-3" key={review._id}>
                            <ReviewList review={review} />
                        </div>
                    ))
                ) )}

                {hasNextPage && 
                <ButtonLoading text='Load More' type='button' loading={isFetching} onClick={() => fetchNextPage()}>

                </ButtonLoading>
                }
            </div>
        </div>
        </div>
        </div>
)
}

export default ProductReview
