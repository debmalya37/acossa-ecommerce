import React from 'react'
import Image from 'next/image'
import usericon from '@/public/assets/images/user.png'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { IoStar } from 'react-icons/io5'

dayjs.extend(relativeTime)

type Review = {
  avatar?: {
    url?: string
  }
  title?: string
  review?: string
    rating?: number
    reviewedBy?: string
    createdAt?: string

}

const ReviewList: React.FC<{ review?: Review }> = ({ review }) => {
  return (
    <div>
      <div className="flex gap-5">
        <div className="w-[60px]">
            <Image
              src={review?.avatar?.url || usericon.src}
              alt="Reviewer Image"
              width={55}
              height={55}
              className="rounded-full object-cover"
            />
        </div>
        <div className="w-[calc(100%-60px)]">
            <div >
                <h4 className='text-xl font-semibold'>{review?.title}</h4>
                <p className='flex gap-2 items-center'><span className='font-medium'>{review?.reviewedBy}</span>
                -
                <span>{dayjs(review?.createdAt).fromNow()}</span>
                <span className='flex items-center text-xm gap-1'>({review?.rating} <IoStar  className='text-yellow-500 mb-1'/>)</span>
                
                </p>
                <p className='mt-3 text-gray-600'>{review?.review}</p>
            </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewList
