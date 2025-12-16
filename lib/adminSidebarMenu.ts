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
                href: "/admin/category",
            },
            {
                title: "Add Category",
                href: "/admin/category/add",
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
                href: "/admin/product",
            },
            {
                title: "Add Product",
                href: "/admin/product/add",
            },
            {
                title: "All Variants",
                href: "/admin/productvariant",
            },
            {
                title: "Add Variant",
                href: "/admin/productvariant/add",
            },
            {
                title: "All Product Addons",
                href: "/admin/productaddons",
            },
            {
                title: "Add Product Addon",
                href: "/admin/productaddons/create",
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
        href: "/admin/customers",
        icon: LuUserRound,

    },
    {
        title: " Rating & Reviews",
        href: "/admin/review",
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
                href: "/admin/coupon",
            },
            {
                title: "Add Coupon",
                href: "/admin/coupon/add",
            },
        ]
    },
    {
        title: "SEO Management Board",
        href: "/admin/seo",
        icon: AiOutlineDashboard,
    },
    {
        title: "Blog",
        href: "/admin/blogs",
        icon: AiOutlineDashboard,
    }
]

