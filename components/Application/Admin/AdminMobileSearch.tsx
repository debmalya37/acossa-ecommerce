'use client'
import { useState } from "react"
import { IoIosSearch } from "react-icons/io"

import SearchModal from "./SearchModal"
import { Button } from "@/components/ui/button"
const AdminMobileSearch = () => {
    const [open, setOpen] = useState(false)
    return (
        <>
            <Button type="button" size="icon" onClick={()=>setOpen(true)} className={"md:hidden"} variant="ghost">
                <IoIosSearch/>
            </Button>
            <SearchModal open={open} setOpen={setOpen}/>
        </>
    )
}

export default AdminMobileSearch