import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/footer";
import { getServerSupabase } from "@/lib/supabase/server";
import { ProductCard, type Product } from "@/components/product-card";

export async function generateStaticParams() {
  // Required for output: export to pre-generate dynamic routes [^1]
  const supabase = getServerSupabase();
  if (!supabase) return [];
  const { data } = await supabase.from("categories").select("id");
  return (data || []).map((c: any) => ({ id: c.id }));
}

export default async function CategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = getServerSupabase();
  if (!supabase) return notFound();

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("id", params.id)
    .single();
  if (!category) return notFound();

  const { data: prods } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", params.id)
    .order("created_at", { ascending: false });

  const products = (prods as Product[]) ?? [];
  const hero = category.image_url || "/category-hero.png";

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="relative mb-6 aspect-[16/5] w-full overflow-hidden rounded-lg border bg-muted">
            <Image
              src={hero || "/placeholder.svg"}
              alt={category.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="text-2xl font-semibold text-white drop-shadow">
                {category.name}
              </h1>
              {category.description ? (
                <p className="mt-1 max-w-3xl text-sm text-white/90">
                  {category.description}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mb-4 text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "product" : "products"}
          </div>

          {products.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-md border bg-muted/40 p-6 text-sm text-muted-foreground">
              No products found in this category.
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
