"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "sonner"

const WishlistContext = createContext({})

export function useWishlist() {
    return useContext(WishlistContext)
}

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem("wishlist")
        if (saved) {
            try {
                setWishlist(JSON.parse(saved))
            } catch (e) {
                console.error("Failed to parse wishlist", e)
            }
        }
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("wishlist", JSON.stringify(wishlist))
        }
    }, [wishlist, isLoaded])

    const addToWishlist = (product) => {
        if (wishlist.some(item => item.id === product.id)) {
            toast.info("Already in your wishlist ✨")
            return
        }
        setWishlist(prev => [...prev, product])
        toast.success("Added to wishlist 💖")
    }

    const removeFromWishlist = (productId) => {
        setWishlist(prev => prev.filter(item => item.id !== productId))
        toast.success("Removed from wishlist")
    }

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId)
    }

    const toggleWishlist = (product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id)
        } else {
            addToWishlist(product)
        }
    }

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
            {children}
        </WishlistContext.Provider>
    )
}
