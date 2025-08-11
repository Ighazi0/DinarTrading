import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = getServerSupabase()
    if (!supabase) {
      return NextResponse.json(
        { products: [], categories: [], banners: [], services: [], orders: [], error: "Supabase not configured" },
        { status: 200 },
      )
    }

    const productsQ = supabase
      .from("products")
      .select("id,title,price,description,image_url,category_id")
      .order("created_at", { ascending: false })
    const categoriesQ = supabase.from("categories").select("*").order("created_at", { ascending: false })
    const bannersQ = supabase.from("banners").select("*").order("created_at", { ascending: false })
    const servicesQ = supabase
      .from("services")
      .select("id,title,brief,slug,description,image_url")
      .order("created_at", { ascending: false })
    const ordersQ = supabase.from("orders").select("*").order("created_at", { ascending: false })

    const [products, categories, banners, services, orders] = await Promise.all([
      productsQ.then((r) => r.data ?? []).catch(() => []),
      categoriesQ.then((r) => r.data ?? []).catch(() => []),
      bannersQ.then((r) => r.data ?? []).catch(() => []),
      servicesQ.then((r) => r.data ?? []).catch(() => []),
      ordersQ.then((r) => r.data ?? []).catch(() => []),
    ])

    return NextResponse.json({ products, categories, banners, services, orders }, { status: 200 })
  } catch {
    return NextResponse.json(
      { products: [], categories: [], banners: [], services: [], orders: [], error: "Failed to load" },
      { status: 200 },
    )
  }
}
