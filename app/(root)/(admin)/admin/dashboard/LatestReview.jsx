import { Avatar, AvatarImage } from "@/components/ui/avatar"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import { IoStar } from "react-icons/io5"
const LatestReview = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead >Product</TableHead>
                    <TableHead >Rating</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i} className={"flex items-center justify-between"}>
                        <TableCell  className="font-medium flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={imgPlaceholder.src} alt="avatar"/>
                            </Avatar>
                            <span className="line-clamp-1">Lorem ipsu</span>
                        </TableCell>
                        <TableCell  className="flex items-center ">
                            {Array.from({length:5}).map((_,i)=>(
                                <span key={i}>
                                    <IoStar className="text-yellow-500"/>
                                </span>
                            ))}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default LatestReview