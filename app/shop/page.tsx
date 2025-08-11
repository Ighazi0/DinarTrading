import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/footer"
import { getServerSupabase } from "@/lib/supabase/server"
import { BannerCarousel } from "@/components/banner-carousel"
import { CategoryCard, type Category } from "@/components/category-card"
import { ProductCard, type Product } from "@/components/product-card"

export default async function ShopPage() {
  const supabase = getServerSupabase()

  const banners = supabase
    ? ((await supabase.from("banners").select("*").order("created_at", { ascending: false })).data ?? [])
    : []

  const categories: Category[] = supabase
    ? ((await supabase.from("categories").select("*").order("created_at", { ascending: false })).data ?? [])
    : []

  const products: Product[] = supabase
    ? ((await supabase.from("products").select("*").order("created_at", { ascending: false })).data ?? [])
    : []

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
          {banners.length > 0 && <BannerCarousel banners={banners} auto height={420} />}
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Categories</h2>
            <span className="text-sm text-muted-foreground">{categories.length} total</span>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {categories.map((c) => (
              <Link key={c.id} href={`/categories/${c.id}`} aria-label={`Open ${c.name} category`}>
                <CategoryCard category={c} compact />
              </Link>
            ))}
            {categories.length === 0 && <div className="text-sm text-muted-foreground">No categories yet.</div>}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Latest Products</h2>
            <Link href="/products" className="text-sm text-muted-foreground hover:underline">
              View all
            </Link>
          </div>
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
