import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
const LatestOrder = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead >Order Id</TableHead>
                    <TableHead >Payment Id</TableHead>
                    <TableHead >Total Item</TableHead>
                    <TableHead >Status</TableHead>
                    <TableHead >Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 20 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell  className="font-medium">{`INV00${i+1}`}</TableCell>
                        <TableCell  className="font-medium">{`PAY${i+1}`}</TableCell>
                        <TableCell  className="font-medium">3</TableCell>
                        <TableCell  className="font-medium">Pending</TableCell>
                        <TableCell  className="font-medium">100</TableCell>

                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default LatestOrder