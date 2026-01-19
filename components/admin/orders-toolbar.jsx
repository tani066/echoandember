"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Search, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"


export function OrdersToolbar() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Initial state from URL
    const [query, setQuery] = useState(searchParams.get("q") || "")
    const [status, setStatus] = useState(searchParams.get("status") || "ALL")
    const [sort, setSort] = useState(searchParams.get("sort") || "desc")

    // Update URL on change
    const updateUrl = (newParams) => {
        const params = new URLSearchParams(searchParams.toString())
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === "ALL" || value === "") {
                params.delete(key)
            } else {
                params.set(key, value)
            }
        })
        router.push(`/admin/orders?${params.toString()}`)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        updateUrl({ q: query })
    }

    const clearFilters = () => {
        setQuery("")
        setStatus("ALL")
        setSort("desc")
        router.push("/admin/orders")
    }

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-lg border shadow-sm items-center">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto flex-1">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search orders, emails, names..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Button type="submit" variant="secondary">Search</Button>
            </form>

            <div className="flex gap-2 w-full md:w-auto">
                {/* Status Filter */}
                <Select value={status} onValueChange={(val) => { setStatus(val); updateUrl({ status: val }) }}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Status</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PAID">Paid</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="SHIPPED">Shipped</SelectItem>
                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                </Select>

                {/* Sort Filter */}
                <Select value={sort} onValueChange={(val) => { setSort(val); updateUrl({ sort: val }) }}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="desc">Newest First</SelectItem>
                        <SelectItem value="asc">Oldest First</SelectItem>
                        <SelectItem value="amount_desc">Highest Amount</SelectItem>
                        <SelectItem value="amount_asc">Lowest Amount</SelectItem>
                    </SelectContent>
                </Select>

                {/* Date Filter */}
                <Input
                    type="date"
                    value={searchParams.get("date") || ""}
                    onChange={(e) => updateUrl({ date: e.target.value })}
                    className="w-auto"
                />

                {/* Clear */}
                {(searchParams.has("q") || searchParams.has("status") || searchParams.has("sort") || searchParams.has("date")) && (
                    <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear Filters">
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    )
}
