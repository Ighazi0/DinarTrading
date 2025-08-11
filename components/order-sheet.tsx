"use client"

import * as React from "react"
import Image from "next/image"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "./cart-provider"
import { placeOrder } from "@/app/shop/actions"
import { useTransition } from "react"
import { toast } from "@/hooks/use-toast"

export function OrderSheet({ children }: { children: React.ReactNode }) {
  const { items, totalPrice, updateQty, removeItem, clear } = useCart()
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  })

  const valid =
    items.length > 0 && form.name.trim().length > 0 && form.phone.trim().length > 0 && form.address.trim().length > 0

  const onSubmit = () => {
    if (!valid) {
      toast({
        title: "Missing required info",
        description: "Please enter your name, phone, and shipping address.",
        variant: "destructive",
      })
      return
    }
    startTransition(async () => {
      const res = await placeOrder({
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        shipping_address: form.address,
        notes: form.notes,
        items: items.map((i) => ({ product_id: i.id, title: i.title, qty: i.qty || 1, price: i.price })),
        total: totalPrice,
      })
      if (res.ok) {
        clear()
        setOpen(false)
        toast({ title: "Order placed", description: "We will contact you shortly." })
      } else {
        toast({ title: "Failed to place order", description: res.error || "Please try again.", variant: "destructive" })
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-4 overflow-y-auto sm:max-w-lg p-4">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <div className="flex-1 space-y-4">
          {items.length === 0 ? (
            <div className="text-sm text-muted-foreground">Your cart is empty.</div>
          ) : (
            <>
              <ul className="space-y-3">
                {items.map((i) => (
                  <li key={i.id} className="flex items-center gap-3 rounded-md border p-4">
                    <div className="relative h-16 w-20 overflow-hidden rounded bg-muted">
                      <Image
                        src={i.image_url || "/placeholder.svg?height=80&width=120&query=product"}
                        alt={i.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{i.title}</div>
                      <div className="text-xs text-muted-foreground">${i.price.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        value={i.qty || 1}
                        onChange={(e) => updateQty(i.id, Math.max(1, Number(e.target.value)))}
                        className="h-8 w-16"
                      />
                      <Button variant="ghost" size="sm" onClick={() => removeItem(i.id)}>
                        Remove
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between rounded-md bg-muted p-3">
                <div className="text-sm font-medium">Total</div>
                <div className="text-base font-semibold">${totalPrice.toFixed(2)}</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <Label htmlFor="address">Shipping Address</Label>
                <Textarea
                  id="address"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
            </>
          )}
        </div>
        <SheetFooter>
          <Button onClick={onSubmit} disabled={!valid || isPending}>
            {isPending ? "Placing..." : "Place Order"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
