import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/footer"
import { getServerSupabase } from "@/lib/supabase/server"
import { ProductCard, type Product } from "@/components/product-card"

export default async function ProductsPage() {
  const supabase = getServerSupabase()
  const products: Product[] = supabase
    ? ((await supabase.from("products").select("*").order("created_at", { ascending: false })).data ?? [])
    : []

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <h1 className="mb-6 text-2xl font-semibold">Our Products</h1>
          {products.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No products yet.</div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
