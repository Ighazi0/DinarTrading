import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const body = await req.json()
  try {
    const supabase = getServerSupabase()
    if (!supabase) return NextResponse.json({ ok: false, error: "Supabase not configured" }, { status: 200 })
    const payload = {
      image_url: String(body.image_url || ""),
      title: String(body.title || ""),
    }
    const { error } = await supabase.from("banners").update(payload).eq("id", body.id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Failed" }, { status: 200 })
  }
}
