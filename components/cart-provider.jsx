"use client"

import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext({})

export function CartProvider({ children }) {
    const [items, setItems] = useState([])
    const [isOpen, setIsOpen] = useState(false)

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
            setItems(JSON.parse(savedCart))
        }
    }, [])

    // Save cart to local storage on change
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items))
    }, [items])

    const addToCart = (product) => {
        setItems(current => {
            // Generate unique ID based on product ID and sorted options string
            // This ensures {Size: "M", Color: "Red"} is same as {Color: "Red", Size: "M"}
            const optionsString = product.options
                ? JSON.stringify(Object.keys(product.options).sort().reduce((obj, key) => {
                    obj[key] = product.options[key];
                    return obj;
                }, {}))
                : "{}"

            const cartId = `${product.id}-${optionsString}`

            const existing = current.find(item => item.cartId === cartId)

            if (existing) {
                return current.map(item =>
                    item.cartId === cartId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            // Add new item with cartId
            return [...current, { ...product, quantity: 1, cartId }]
        })
        setIsOpen(true) // Open cart when adding item
    }

    const removeFromCart = (cartId) => {
        setItems(current => current.filter(item => item.cartId !== cartId))
    }

    const updateQuantity = (cartId, delta) => {
        setItems(current =>
            current.map(item => {
                if (item.cartId === cartId) {
                    const newQuantity = Math.max(1, item.quantity + delta)
                    return { ...item, quantity: newQuantity }
                }
                return item
            })
        )
    }

    const clearCart = () => setItems([])

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const count = items.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            isOpen,
            setIsOpen,
            total,
            count
        }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)
