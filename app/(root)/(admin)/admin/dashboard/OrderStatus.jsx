"use client"

import { Label, Pie, PieChart } from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
export const description = "Order Status"
const chartData = [
    { status: "pending", visitors: 275, fill: "var(--color-pending)" },
    { status: "processing", visitors: 200, fill: "var(--color-processing)" },
    { status: "shipped", visitors: 187, fill: "var(--color-shipped)" },
    { status: "delivered", visitors: 173, fill: "var(--color-delivered)" },
    { status: "cancelled", visitors: 90, fill: "var(--color-cancelled)" },
    { status: "unverified", visitors: 90, fill: "var(--color-cyan-500)" },
]

const chartConfig = {
    status: {
        label: "Status",
    },
    pending: {
        label: "Pending",
        color: "var(--chart-1)",
    },
    processing: {
        label: "Processing",
        color: "var(--chart-2)",
    },
    shipped: {
        label: "Shipped",
        color: "var(--chart-3)",
    },
    delivered: {
        label: "Delivered",
        color: "var(--chart-4)",
    },
    cancelled: {
        label: "Cancelled",
        color: "var(--chart-5)",
    },
    unverified: {
        label: "Unverified",
        color: "#000",
    },
}

export function OrderStatus() {

    return (
        <div>
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
            >
                <PieChart>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                    />
                    <Pie
                        data={chartData}
                        dataKey="visitors"
                        nameKey="status"
                        innerRadius={60}
                    >
                        <Label
                            content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            <tspan
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                className="fill-foreground text-3xl font-bold"
                                            >
                                                100
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 24}
                                                className="fill-muted-foreground"
                                            >
                                                Orders
                                            </tspan>
                                        </text>
                                    )
                                }
                            }}
                        />
                    </Pie>
                </PieChart>
            </ChartContainer>
            <div className="">
                <ul>
                    <li className="flex justify-between items-center mb-3 text-sm">
                        <span>Pending</span>
                        <span className="rounded-full px-2 text-sm bg-chart-1 text-white">0</span>
                    </li>
                     <li className="flex justify-between items-center mb-3 text-sm">
                        <span>Processing</span>
                        <span className="rounded-full px-2 text-sm bg-chart-2 text-white">0</span>
                    </li>
                    <li className="flex justify-between items-center mb-3 text-sm">
                        <span>Shipped</span>
                        <span className="rounded-full px-2 text-sm bg-chart-3 text-white">0</span>
                    </li>
                    <li className="flex justify-between items-center mb-3 text-sm">
                        <span>Delivered</span>
                        <span className="rounded-full px-2 text-sm bg-chart-4 text-white">0</span>
                    </li>
                    <li className="flex justify-between items-center mb-3 text-sm">
                        <span>Cancelled</span>
                        <span className="rounded-full px-2 text-sm bg-chart-5 text-white">0</span>
                    </li>
                    <li className="flex justify-between items-center mb-3 text-sm">
                        <span>Unverified</span>
                        <span className="rounded-full px-2 text-sm bg-cyan-500 text-white">0</span>
                    </li>
                </ul>
            </div>
        </div>

    )
}
