import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const body = await req.json()
  try {
    const supabase = getServerSupabase()
    if (!supabase) return NextResponse.json({ ok: false, error: "Supabase not configured" }, { status: 200 })
    const { error } = await supabase.from("services").insert({
      title: String(body.title || "").trim(),
      brief: String(body.brief || ""),
      description: String(body.description || ""),
      image_url: String(body.image_url || ""),
      slug: String(body.slug || ""),
    })
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Failed" }, { status: 200 })
  }
}
