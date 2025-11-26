"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { useSelector } from "react-redux"
import { IoShirtOutline } from "react-icons/io5"
import { MdOutlineShoppingBag } from "react-icons/md"
import Link from "next/link"
import LogoutButton from "./LogoutButton"
// import LogoutButton from "./LogoutButton"

const UserDropDown = () => {
    // const auth = useSelector((store)=>store.authStore.auth)
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="">
                    <AvatarImage src="https://github.com/shadcn.png" className="object-cover"/>
                    <AvatarFallback className="">CN</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={"me-5 w-44"}>
                <DropdownMenuLabel className="" inset={false}>
                    <p className="font-semibold">
                        {/* {auth?.name} */}
                    </p>

                </DropdownMenuLabel>
                <DropdownMenuSeparator className="" />
                <DropdownMenuItem asChild className="" inset={false}>
                    <Link href="" className="cursor-pointer">
                        <IoShirtOutline/>
                        New Product
                    </Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild className="" inset={false}>
                    <Link href="" className="cursor-pointer">
                        <MdOutlineShoppingBag/>
                        Orders
                    </Link>
                </DropdownMenuItem>
                <LogoutButton/>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserDropDown