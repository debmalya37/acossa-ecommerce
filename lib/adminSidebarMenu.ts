import { AiOutlineDashboard } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import { LuUserRound } from "react-icons/lu";
import { IoMdStarOutline } from "react-icons/io";
import { MdOutlinePermMedia } from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";

export const adminAppSidebarMenu =  [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: AiOutlineDashboard,
    },
    {
        title: "Categories",
        href: "#",
        icon: BiCategory,
        submenu : [
            {
                title: "All Categories",
                href: "/admin/categories",
            },
            {
                title: "Add Category",
                href: "/admin/categories/add",
            },
        ]
    },
    {
        title: "Products",
        href: "#",
        icon: IoShirtOutline,
        submenu: [
            {
                title: "All Products",
                href: "/admin/products",
            },
            {
                title: "Add Product",
                href: "/admin/products/add",
            },
            {
                title: "All Variants",
                href: "/admin/products/add",
            },
            {
                title: "Add Variant",
                href: "/admin/products/add",
            }
        ]
    },
    {
        title: "Orders",
        href: "/admin/orders",
        icon: MdOutlineShoppingBag,
    },
    {
        title: "Customers",
        href: "/admin/users",
        icon: LuUserRound,

    },
    {
        title: " Rating & Reviews",
        href: "/admin/reviews",
        icon: IoMdStarOutline,
    },
    {
        title: "Media",
        href: "/admin/media",
        icon: MdOutlinePermMedia,
    },
    {
        title: "Coupons",
        href: "#",
        icon: RiCoupon2Line,
        submenu: [
            {
                title: "All Coupons",
                href: "/admin/coupons",
            },
            {
                title: "Add Coupon",
                href: "/admin/coupons/add",
            },
        ]
    },
]