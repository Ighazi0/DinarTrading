import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/footer";
import { BannerCarousel } from "@/components/banner-carousel";
import { getServerSupabase } from "@/lib/supabase/server";
import { ProductCard, type Product } from "@/components/product-card";
import { ServiceCard, type Service } from "@/components/service-card";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const supabase = getServerSupabase();

  const banners = supabase
    ? (
        await supabase
          .from("banners")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5)
      ).data ?? []
    : [];

  const products: Product[] = supabase
    ? (
        await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10)
      ).data ?? []
    : [];

  const services: Service[] = supabase
    ? (
        await supabase
          .from("services")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(6)
      ).data ?? []
    : [];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
          {banners.length > 0 && <BannerCarousel banners={banners} />}
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Our Products</h2>
            <Link
              href="/products"
              className="text-sm text-muted-foreground hover:underline"
            >
              View all
            </Link>
          </div>
          {products.length > 0 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {products.map((p) => (
                <div key={p.id} className="min-w-[280px] max-w-[300px] flex-1">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Our Services</h2>
            <Link
              href="/services"
              className="text-sm text-muted-foreground hover:underline"
            >
              Explore services
            </Link>
          </div>
          {services.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
