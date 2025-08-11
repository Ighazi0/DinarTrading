import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const supabase = getServerSupabase()
    if (!supabase) return NextResponse.json({ ok: false, error: "Supabase not configured" }, { status: 200 })

    const form = await req.formData()
    const file = form.get("file") as File | null
    const folder = (form.get("folder") as string) || "uploads"

    if (!file) return NextResponse.json({ ok: false, error: "No file provided" }, { status: 200 })

    const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin"
    const filename = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`

    // Upload to a public bucket named "public"
    const { error: uploadError } = await supabase.storage.from("assets").upload(filename, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "application/octet-stream",
    })
    if (uploadError) throw uploadError

    const { data: urlData } = supabase.storage.from("assets").getPublicUrl(filename)
    return NextResponse.json({ ok: true, path: filename, url: urlData.publicUrl })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Upload failed" }, { status: 200 })
  }
}
