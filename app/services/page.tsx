import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/footer"
import { getServerSupabase } from "@/lib/supabase/server"
import { ServiceCard, type Service } from "@/components/service-card"

export default async function ServicesPage() {
  const supabase = getServerSupabase()
  const services: Service[] = supabase
    ? ((await supabase.from("services").select("*").order("created_at", { ascending: false })).data ?? [])
    : []

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <h1 className="mb-6 text-2xl font-semibold">Our Services</h1>
          {services.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No services yet.</div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
