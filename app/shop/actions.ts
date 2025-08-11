"use server"

import { getServerSupabase } from "@/lib/supabase/server"

export async function placeOrder(input: {
  customer_name: string
  customer_email: string
  customer_phone?: string
  shipping_address?: string
  notes?: string
  items: { product_id: string; title: string; qty: number; price: number }[]
  total: number
}) {
  try {
    const supabase = getServerSupabase()
    if (!supabase) {
      return { ok: false, error: "Supabase not configured" }
    }
    const { error } = await supabase.from("orders").insert({
      customer_name: input.customer_name,
      customer_email: input.customer_email,
      customer_phone: input.customer_phone,
      shipping_address: input.shipping_address,
      notes: input.notes,
      items: input.items,
      total: input.total,
      status: "pending",
    })
    if (error) throw error
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e?.message || "Error placing order" }
  }
}
