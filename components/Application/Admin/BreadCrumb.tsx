import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
interface BreadcrumbData {
    href: string;
    label: string;
}

const BreadCrumb = ({breadcrumbData}: { breadcrumbData: BreadcrumbData[] }) => {
    return (
        <Breadcrumb className="mb-5">
            <BreadcrumbList>
              {breadcrumbData.length > 0 && breadcrumbData.map((data,index)=>(
                index !== breadcrumbData.length - 1 
                ? 
                <div key={index} className="flex items-center">
                    <BreadcrumbItem>
                        <BreadcrumbLink href={data.href}>{data.label}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className={"ms-2"}/>
                </div>
                :
                <div key={index}>
                    <BreadcrumbItem>
                        <BreadcrumbLink className={"font-semibold"} href={data.href}>{data.label}</BreadcrumbLink>
                    </BreadcrumbItem>
                </div>
              ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default BreadCrumb