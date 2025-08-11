import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/footer";
import { getServerSupabase } from "@/lib/supabase/server";

export async function generateStaticParams() {
  // Required when using output: export with dynamic segments [^1]
  const supabase = getServerSupabase();
  if (!supabase) return [];
  const { data } = await supabase.from("services").select("slug");
  return (data || []).map((s: any) => ({ slug: s.slug }));
}

export default async function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = getServerSupabase();
  if (!supabase) return notFound();

  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("slug", params.slug)
    .single();
  if (!service) return notFound();

  const image = service.image_url || "/service-hero.png";

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-4 py-10 md:px-6">
          <div className="relative mb-6 aspect-[16/8] w-full overflow-hidden rounded-lg border bg-muted">
            <Image
              src={image || "/placeholder.svg"}
              alt={service.title}
              fill
              className="object-cover"
            />
          </div>
          <h1 className="mb-4 text-2xl font-semibold">{service.title}</h1>
          <article className="prose max-w-none">
            <p className="text-lg leading-7">
              {service.description || service.brief}
            </p>
          </article>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
