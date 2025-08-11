import Image from "next/image"
import { Card } from "@/components/ui/card"

export type Category = {
  id: string
  name: string
  description?: string | null
  image_url?: string | null
}

export function CategoryCard({
  category,
  compact = false,
}: {
  category: Category
  compact?: boolean
}) {
  const image = category.image_url || "/abstract-category.png"
  // Compact: smaller visual footprint (shorter aspect, smaller text)
  const aspect = compact ? "aspect-[16/10]" : "aspect-[4/3]"
  const textSize = compact ? "text-[11px] sm:text-xs" : "text-xs sm:text-sm"

  return (
    <Card className="overflow-hidden">
      <div className={`relative ${aspect} w-full`}>
        <Image src={image || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-x-0 bottom-0 p-1.5 sm:p-2">
          <div className={`rounded bg-black/55 px-2 py-1 font-medium text-white ${textSize}`}>{category.name}</div>
        </div>
      </div>
    </Card>
  )
}
