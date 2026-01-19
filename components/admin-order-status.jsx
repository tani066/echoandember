"use client"

import { useState } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { updateOrderStatus } from "@/app/actions"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function AdminOrderStatus({ orderId, currentStatus }) {
    const [status, setStatus] = useState(currentStatus)
    const [isUpdating, setIsUpdating] = useState(false)

    const handleStatusChange = async (newStatus) => {
        setStatus(newStatus)
        setIsUpdating(true)
        try {
            await updateOrderStatus(orderId, newStatus)
            toast.success("Order Status Updated", {
                description: `Status changed to ${newStatus}`,
            })
        } catch (error) {
            toast.error("Error", {
                description: "Failed to update status",
            })
            setStatus(currentStatus) // Revert on error
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Select value={status} onValueChange={handleStatusChange} disabled={isUpdating}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="DISPATCHED">Dispatched</SelectItem>
                    <SelectItem value="ON_THE_WAY">On The Way</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
            </Select>
            {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
    )
}
