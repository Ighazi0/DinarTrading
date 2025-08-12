"use client"

import type React from "react"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type CartItem = {
  id: string
  title: string
  price: number
  image_url?: string | null
  qty?: number
}

type CartCtx = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "qty">) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clear: () => void
  totalQty: number
  totalPrice: number
}

const Ctx = createContext<CartCtx | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart")
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items))
    } catch {}
  }, [items])

  const value = useMemo<CartCtx>(() => {
    const addItem = (item: Omit<CartItem, "qty">) => {
      setItems((prev) => {
        const existing = prev.find((p) => p.id === item.id)
        if (existing) {
          return prev.map((p) => (p.id === item.id ? { ...p, qty: (p.qty || 0) + 1 } : p))
        }
        return [...prev, { ...item, qty: 1 }]
      })
    }
    const removeItem = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id))
    const updateQty = (id: string, qty: number) =>
      setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)))
    const clear = () => setItems([])
    const totalQty = items.reduce((s, i) => s + (i.qty || 0), 0)
    const totalPrice = items.reduce((s, i) => s + i.price * (i.qty || 0), 0)
    return { items, addItem, removeItem, updateQty, clear, totalQty, totalPrice }
  }, [items])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
