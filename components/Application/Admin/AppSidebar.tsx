"use client";

import React from 'react'
// import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
 
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import logoBlack from '@/public/assets/images/logo/acossa.jpg'
import logoWhite from '@/public/assets/images/logo/acossa.jpg'
import { Button } from '@/components/ui/button'
import IoMdClose, { IoMdCloseCircle } from 'react-icons/io'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { adminAppSidebarMenu } from '@/lib/adminSidebarMenu'
// import { CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible'
import Link from 'next/link'
import { LuChevronRight } from 'react-icons/lu'
const AppSidebar = () => {
  return (
      <Sidebar>
      <SidebarHeader className='border-b h-14 p-0'>
        <div className='flex justify-between items-center px-4'>
            <Image src={logoBlack.src} height={50} width={logoBlack.width} className='black dark:hidden h-[50px] w-auto' alt='logo' />
            <Image src={logoWhite.src} height={50} width={logoWhite.width} className='hidden dark:block h-[50px] w-auto'  alt='logo'/>
            <Button type='button' size="icon"  className='sm:hidden md:block items-center justify-center'>
                {/* <IoMdCloseCircle className='object-center'/> */}X
            </Button>
        </div>

      </SidebarHeader>

      <SidebarContent className='p-3'>
        <SidebarMenu>
            {adminAppSidebarMenu.map((menu, index) => (
                <Collapsible key={index} className='group/collabsible' >
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                        <SidebarMenuButton className='font-semibold px-2 py-5' asChild>
                            <Link href={menu?.href}>
                            <menu.icon />
                            {menu.title}

                            {menu.submenu && menu.submenu.length > 0 &&
                                <LuChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            }
                            </Link>
                        </SidebarMenuButton>
                        </CollapsibleTrigger>

                        {menu.submenu && menu.submenu.length > 0 
                        && <CollapsibleContent>
                             <SidebarMenuSub>
                                {menu.submenu.map((subMenuItem, subMenuIndex) => (
                                    <SidebarMenuSubItem key={subMenuIndex}>
                                        <SidebarMenuSubButton className=' px-2 py-5' asChild>
                                        <Link href={subMenuItem.href}>
                                        {subMenuItem.title}
                                        </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                ))}
                             </SidebarMenuSub>
                        </CollapsibleContent>
                        }
                    </SidebarMenuItem>
                </Collapsible>
            ))}

        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar
