"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

export function BackButton({ className }) {
    const router = useRouter()
    const pathname = usePathname()

    // Don't show on home page
    if (pathname === "/") return null

    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn("hover:bg-slate-100 rounded-full", className)}
            onClick={() => router.back()}
        >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
        </Button>
    )
}
