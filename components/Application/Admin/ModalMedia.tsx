import axios from "axios"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query"
import Image from "next/image"
import loading from '@/public/assets/images/loading.svg'
import React, { useState } from "react"
import ModalMediaBlock from "./ModalMediaBlock"
import { showToast } from "@/lib/showToast"
import ButtonLoading from "../LoadingButton"

interface MediaItem {
  _id: string;
  secure_url?: string;
  thumbnail_url?: string;
  path?: string;
  alt?: string;
}


interface ModalMediaProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedMedia: MediaItem[];
  setSelectedMedia: (ids: MediaItem[]) => void;
  isMultiple: boolean;
}

const ModalMedia = ({ open, setOpen, selectedMedia, setSelectedMedia, isMultiple }: ModalMediaProps) => {
    const [previouslySelected, setPreviouslySelected] = useState<MediaItem[]>([]);

    const fetchMedia = async (page:any) => {
        const { data: response } = await axios.get(`/api/media?page=${page}&&limit=18&&deleteType=SD`)
        return response
    }


    const { isPending, isError, error, data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['MediaModal'],
        queryFn: async ({ pageParam }) => await fetchMedia(pageParam),
        placeholderData: keepPreviousData,
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length
            return lastPage.hasMore ? nextPage : undefined
        }
    })
    const handleClear = () => {
        setSelectedMedia([])
        setPreviouslySelected([])
        showToast('success', 'Media selection cleared.')
    }
    const handleClose = () => {
        setSelectedMedia(previouslySelected)
        setOpen(false)
    }
    const handleSelect = () => {
        if (selectedMedia.length <= 0) {
            return showToast('error', 'Please select a media')
        }
        setPreviouslySelected(selectedMedia)
        setOpen(false)
    }
    console.log(hasNextPage)
    return (
        <Dialog
            open={open}
            onOpenChange={() => setOpen(!open)}
        >
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                className={"sm:max-w-[80%] h-screen p-0 py-10 bg-transparent border-0 shadow-none"}
            >
                <DialogDescription className={"hidden"}>
                </DialogDescription>

                <div className="h-[90vh] bg-white dark:bg-card p-3 rounded shadow">
                    <DialogHeader className={"h-8 border-b"} >
                        <DialogTitle className={"text-black dark:text-white"}>Media Selection</DialogTitle>
                    </DialogHeader>
                    <div className="h-[calc(100%-80px)] overflow-auto py-2]">
                        {
                            isPending ?
                                (<div className="size-full flex justify-center items-center">
                                    <Image
                                        src={loading}
                                        alt="loading"
                                        height={80}
                                        width={80}
                                    />
                                </div>)
                                :
                                isError ?
                                    <div className="size-full flex justify-center items-center">
                                        <span className="text-red-500">
                                            {error?.message}
                                        </span>
                                    </div>
                                    :
                                    <>
                                        <div className="grid lg:grid-cols-6 grid-cols-3 gap-2">
                                            {
                                                data?.pages?.map((page, index) => (
                                                    <React.Fragment key={index}>
                                                        {
                                                            page?.mediaData?.map((media: MediaItem) => (
                                                                <ModalMediaBlock
                                                                        key={media._id}
                                                                        media={media}
                                                                        selectedMedia={selectedMedia}
                                                                        setSelectedMedia={setSelectedMedia }
                                                                        isMultiple={isMultiple}
                                                                    />
                                                            ))
                                                        }
                                                    </React.Fragment>
                                                ))
                                            }
                                        </div>

                                        {
                                            hasNextPage ?
                                                <div className="flex justify-center py-5">
                                                    <ButtonLoading
                                                        type={"button"}
                                                        loading={isFetching}
                                                        text="Load More"
                                                        onClick={() => fetchNextPage()}
                                                    />
                                                </div>
                                                :
                                                <p className="text-center py-5  dark:text-white text-black">
                                                    Nothing more to load.
                                                </p>
                                        }
                                    </>

                        }
                    </div>

                    <div className="h-10 pt-3 border-t flex justify-between">
                        <div>
                            <Button type="button" variant={"destructive"} onClick={handleClear}>
                                Clear All
                            </Button>
                        </div>
                        <div className="flex gap-5">
                            <Button type="button" variant={"secondary"} onClick={handleClose}>
                                Close
                            </Button>
                            <Button type="button" onClick={handleSelect}>
                                Select
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ModalMedia