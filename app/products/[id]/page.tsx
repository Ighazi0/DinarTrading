import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/footer";
import { getServerSupabase } from "@/lib/supabase/server";
import { AddToCartButton } from "@/components/add-to-cart-button";

export async function generateStaticParams() {
  // Required for output: export to pre-generate dynamic routes [^1]
  const supabase = getServerSupabase();
  if (!supabase) return [];
  const { data } = await supabase.from("products").select("id");
  return (data || []).map((p: any) => ({ id: p.id }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = getServerSupabase();
  let product: any = null;

  if (supabase) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("id", params.id)
      .single();
    product = data;
  }

  if (!product) return notFound();

  const image = product.image_url || "/generic-product.png";

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-10 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border bg-muted">
              <Image
                src={image || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{product.title}</h1>
              <div className="mt-2 text-xl font-bold">
                ${Number(product.price).toFixed(2)}
              </div>
              <div className="mt-4 text-muted-foreground">
                {product.description}
              </div>

              <div className="mt-6 flex items-center gap-3">
                <AddToCartButton
                  product={{
                    id: product.id,
                    title: product.title,
                    price: Number(product.price),
                    image_url: product.image_url,
                  }}
                />
              </div>

              <div className="mt-8 rounded-md border bg-muted/40 p-4">
                <div className="text-sm font-medium">Shipping & Logistics</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  We provide global shipping, customs clearance, and end-to-end
                  logistics. Contact us for bulk orders and tailored supply
                  solutions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
