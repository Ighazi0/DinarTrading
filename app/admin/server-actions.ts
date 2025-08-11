"use client"

import { useCallback, useEffect, useState } from "react"
import { getBrowserSupabase } from "@/lib/supabase/client"

// Types
type Product = {
  id: string
  title: string
  price: number
  description?: string
  image_url?: string
  category_id?: string
}
type Category = { id: string; name: string; description?: string | null; image_url?: string | null }
type Banner = { id: string; image_url: string; title?: string | null }
type Service = {
  id: string
  title: string
  brief: string
  slug: string
  description?: string
  image_url?: string | null
}
type Order = {
  id: string
  customer_name: string
  customer_email: string
  customer_phone?: string | null
  shipping_address?: string | null
  notes?: string | null
  items: any[]
  total: number
  status: string
}

export function useAdminLists() {
  const [state, setState] = useState<{
    products: Product[]
    categories: Category[]
    banners: Banner[]
    services: Service[]
    orders: Order[]
    error?: string
  }>({
    products: [],
    categories: [],
    banners: [],
    services: [],
    orders: [],
  })

  const refresh = useCallback(async () => {

    const supabase = getBrowserSupabase()
    if (!supabase) {
      setState((s) => ({ ...s, error: "Supabase not configured on client (NEXT_PUBLIC_* vars missing)" }))
      return
    }
    const [products, categories, banners, services, orders] = await Promise.all([
      supabase.from("products").select("id,title,price,description,image_url,category_id").order("created_at", {
        ascending: false,
      }),
      supabase.from("categories").select("*").order("created_at", { ascending: false }),
      supabase.from("banners").select("*").order("created_at", { ascending: false }),
      supabase.from("services").select("id,title,brief,slug,description,image_url").order("created_at", {
        ascending: false,
      }),
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
    ])
    setState({
      products: products.data ?? [],
      categories: categories.data ?? [],
      banners: banners.data ?? [],
      services: services.data ?? [],
      orders: orders.data ?? [],
    })
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { ...state, refresh }
}

async function tryPostJSON(url: string, body: any) {
  try {
    const res = await fetch(url, { method: "POST", body: JSON.stringify(body) })
    if (!res.ok) return null
    return (await res.json()) as any
  } catch {
    return null
  }
}

// CREATE
export async function createProduct(input: {
  title: string
  description?: string
  price: number
  image_url?: string
  category_id?: string
}) {
  const viaRoute = await tryPostJSON("/admin/action/create-product", input)
  if (viaRoute) return viaRoute
  const supabase = getBrowserSupabase()
  if (!supabase) return { ok: false, error: "Supabase client not configured in browser" }
  const { error } = await supabase.from("products").insert(input as any)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function createCategory(input: { name: string; description?: string; image_url?: string }) {
  const viaRoute = await tryPostJSON("/admin/action/create-category", input)
  if (viaRoute) return viaRoute
  const supabase = getBrowserSupabase()
  if (!supabase) return { ok: false, error: "Supabase client not configured in browser" }
  const { error } = await supabase.from("categories").insert(input as any)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function createBanner(input: { image_url: string; title?: string }) {
  const viaRoute = await tryPostJSON("/admin/action/create-banner", input)
  if (viaRoute) return viaRoute
  const supabase = getBrowserSupabase()
  if (!supabase) return { ok: false, error: "Supabase client not configured in browser" }
  const { error } = await supabase.from("banners").insert(input as any)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function createService(input: {
  title: string
  brief: string
  description?: string
  image_url?: string
  slug: string
}) {
  const viaRoute = await tryPostJSON("/admin/action/create-service", input)
  if (viaRoute) return viaRoute
  const supabase = getBrowserSupabase()
  if (!supabase) return { ok: false, error: "Supabase client not configured in browser" }
  const { error } = await supabase.from("services").insert(input as any)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// UPDATE
export async function updateProduct(input: {
  id: string
  title: string
  description?: string
  price: number
  image_url?: string
  category_id?: string | null
}) {
  const viaRoute = await tryPostJSON("/admin/action/update-product", input)
  if (viaRoute) return viaRoute
  const supabase = getBrowserSupabase()
  if (!supabase) return { ok: false, error: "Supabase client not configured in browser" }
  const { error } = await supabase
    .from("products")
    .update(input as any)
    .eq("id", input.id)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
export async function updateCategory(input: { id: string; name: string; description?: string; image_url?: string }) {
  const viaRoute = await tryPostJSON("/admin/action/update-category", input)
  if (viaRoute) return viaRoute
  const supabase = getBrowserSupabase()
  if (!supabase) return { ok: false, error: "Supabase client not configured in browser" }
  const { error } = await supabase
    .from("categories")
    .update(input as any)
    .eq("id", input.id)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
export async function updateBanner(input: { id: string; image_url: string; title?: string }) {
  const viaRoute = await tryPostJSON("/admin/action/update-banner", input)
  if (viaRoute) return viaRoute
  const supabase = getBrowserSupabase()
  if (!supabase) return { ok: false, error: "Supabase client not configured in browser" }
  const { error } = await supabase
    .from("banners")
    .update(input as any)
    .eq("id", input.id)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
export async function updateService(input: {
  id: string
  title: string
  brief: string
  description?: string
  image_url?: string
  slug: string
}) {
  const viaRoute = await tryPostJSON("/admin/action/update-service", input)
  if (viaRoute) return viaRoute
  const supabase = getBrowserSupabase()
  if (!supabase) return { ok: false, error: "Supabase client not configured in browser" }
  const { error } = await supabase
    .from("services")
    .update(input as any)
    .eq("id", input.id)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// DELETE
export async function deleteProduct(id: string) {
  const viaRoute = await tryPostJSON("/admin/action/delete-product", { id })
  if (viaRoute) return viaRoute
  const supabase = getBrowserSupabase()
  if (!supabase) return { ok: false, error: "Supabase client not configured in browser" }
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
export async function deleteCategory(id: string) {
  const viaRoute = await tryPostJSON("/admin/action/delete-category", { id })
  if (viaRoute) return viaRoute
  const supabase = getBrowserSupabase()
  if (!supabase) return { ok: false, error: "Supabase client not configured in browser" }
  const { error } = await supabase.from("categories").delete().eq("id", id)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
export async function deleteBanner(id: string) {
  const viaRoute = await tryPostJSON("/admin/action/delete-banner", { id })
  if (viaRoute) return viaRoute
  const supabase = getBrowserSupabase()
  if (!supabase) return { ok: false, error: "Supabase client not configured in browser" }
  const { error } = await supabase.from("banners").delete().eq("id", id)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
export async function deleteService(id: string) {
  const viaRoute = await tryPostJSON("/admin/action/delete-service", { id })
  if (viaRoute) return viaRoute
  const supabase = getBrowserSupabase()
  if (!supabase) return { ok: false, error: "Supabase client not configured in browser" }
  const { error } = await supabase.from("services").delete().eq("id", id)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// Orders
export async function updateOrderStatus(id: string, status: string) {
  const viaRoute = await tryPostJSON("/admin/action/update-order", { id, status })
  if (viaRoute) return viaRoute
  const supabase = getBrowserSupabase()
  if (!supabase) return { ok: false, error: "Supabase client not configured in browser" }
  const { error } = await supabase.from("orders").update({ status }).eq("id", id)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
export async function deleteOrder(id: string) {
  const viaRoute = await tryPostJSON("/admin/action/delete-order", { id })
  if (viaRoute) return viaRoute
  const supabase = getBrowserSupabase()
  if (!supabase) return { ok: false, error: "Supabase client not configured in browser" }
  const { error } = await supabase.from("orders").delete().eq("id", id)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
