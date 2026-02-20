"use client"

import { ChevronDown } from "lucide-react"

export function SortDropdown({ sort, q, category }) {
    return (
        <form action="/shop" method="GET" className="relative cursor-pointer">
            {/* Preserve existing filters in form parameters */}
            {q && <input type="hidden" name="q" value={q} />}
            {category && <input type="hidden" name="category" value={category} />}

            <select
                name="sort"
                defaultValue={sort}
                onChange={(e) => e.target.form.submit()}
                className="appearance-none flex items-center gap-2 text-sm font-medium bg-slate-50 px-4 py-2 pr-8 rounded-lg border border-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-200"
            >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
        </form>
    )
}
