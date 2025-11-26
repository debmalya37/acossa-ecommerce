'use client'
// import { Button } from "../ui/button"
import { useSidebar } from "@/components/ui/sidebar";
import AdminSearchComp from "./AdminSearchComp";
import ThemeSwitch from "./ThemeSwitch"
import UserDropDown from "./UserDropDown"
import { RiMenu4Fill } from "react-icons/ri";
import logoBlack from '@/public/assets/images/logo-black.png'
import logoWhite from '@/public/assets/images/logo-white.png'
import Image from "next/image";
import AdminMobileSearch from "./AdminMobileSearch";
import { Button } from "@/components/ui/button";

const Topbar = () => {
    const { toggleSidebar } = useSidebar()
    return (
        <div className="fixed border h-14 w-full left-0 md:w-[calc(100vw-16rem)] top-0 md:left-64 px-5 z-30 md:ps-72 flex justify-between items-center bg-white dark:bg-card">
            <div className="md:block hidden">
                <AdminSearchComp />
            </div>
            <div className="flex items-center md:hidden">
                <Image
                    src={logoBlack.src}
                    height={50}
                    width={logoBlack.width}
                    className="block dark:hidden h-[50px] w-auto"
                    alt="logo dark"
                />
                <Image
                    src={logoWhite.src}
                    height={50}
                    width={logoWhite.width}
                    className="hidden dark:block h-[50px] w-auto"
                    alt="logo white"
                />
            </div>
            <div className="flex items-center gap-2">
                <AdminMobileSearch/>
                <ThemeSwitch />
                <UserDropDown />
                <Button onClick={toggleSidebar} type="button" size={"icon"} className={"ms-2 md:hidden"} >
                    <RiMenu4Fill />
                </Button>
            </div>
        </div>
    )
}

export default Topbar;

// function useSidebar(): { toggleSidebar: () => void; } {
//     throw new Error("Function not implemented.");
// }
