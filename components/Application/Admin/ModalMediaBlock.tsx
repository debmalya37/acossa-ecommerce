/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"

type DeleteType = "SD" | "PD" | "RSD";

interface MediaItem {
  _id: string;
  secure_url?: string;
  thumbnail_url?: string;
  path?: string;
  alt?: string;
}

interface MediaProps {
  media: MediaItem;
  deleteType: DeleteType;
  selectedMedia: MediaItem[];
  setSelectedMedia: (ids: MediaItem[]) => void;
  handleDelete: (ids: string[], deleteType: DeleteType) => void;
}
const ModalMediaBlock = ({ media, selectedMedia, setSelectedMedia, isMultiple }: {media: MediaItem, selectedMedia: MediaItem[], setSelectedMedia: (ids: MediaItem[]) => void, isMultiple: boolean }) => {
    const handleCheck = () => {
        let newSelectedMedia: MediaItem[] = []
        const isSelected = selectedMedia.find((m: MediaItem) => m._id === media._id) ? true : false
        if (isMultiple) {
            //select multiple media
            if (isSelected) {
                //remove selected media from array
                newSelectedMedia = selectedMedia.filter((m: MediaItem) => m._id !== media._id)
            }
            else {
                //add new media into array
                newSelectedMedia = [...selectedMedia, {
                    _id: media._id,
                    secure_url: media.secure_url
                }]
            }
            setSelectedMedia(newSelectedMedia)
        } else {
            //select single media
            setSelectedMedia([{ _id: media._id, secure_url: media.secure_url }])
        }
    }
    return (
        <label
            htmlFor={media._id}
            className="border border-gray-200 dark:border-gray-800 relative group rounded overflow-hidden"
        >
            <div className="absolute top-2 left-2 z-20">
                <Checkbox
                    id={media._id}
                    checked={selectedMedia.find(m => m._id === media._id) ? true : false}
                    onCheckedChange={handleCheck}
                />
            </div>
            <div className="size-full relative">
                <Image
                    src={media.secure_url || media.thumbnail_url || media.path || "/placeholder.png"}
                    alt={media.alt || ""}
                    width={300}
                    height={300}
                    className="object-cover md:h-[150px] h-[100px]"
                />
            </div>
        </label>
    )
}

export default ModalMediaBlock