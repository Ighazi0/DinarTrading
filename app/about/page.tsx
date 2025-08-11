import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/footer"
import { getServerSupabase } from "@/lib/supabase/server"

export default async function AboutPage() {
  const supabase = getServerSupabase()
  const settings = supabase ? (await supabase.from("site_settings").select("*").single()).data : null

  const about =
    settings?.about_content ||
    "We are a trading company specializing in general trade, import and export, supply, and comprehensive shipping, customs clearance, and logistics solutions. Our mission is to deliver reliable, efficient, and cost-effective services across global markets, ensuring compliance and timely delivery at every step."
  const image = settings?.about_image_url || "/about-our-company.png"

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-10 md:px-6">
          <div className="relative mb-6 aspect-[16/6] w-full overflow-hidden rounded-lg border bg-muted">
            <Image src={image || "/placeholder.svg"} alt="About us" fill className="object-cover" />
          </div>
          <article className="prose max-w-none">
            <p className="text-balance text-lg leading-7">{about}</p>
          </article>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
