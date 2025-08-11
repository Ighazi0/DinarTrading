"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export type Banner = {
  id: string
  image_url: string
  title?: string | null
}

export function BannerCarousel({
  banners,
  height = 420,
  auto = true,
  interval = 3500,
}: { banners: Banner[]; height?: number; auto?: boolean; interval?: number }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!auto || banners.length <= 1) return
    const id = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % banners.length
        const el = scrollerRef.current
        if (el) {
          el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" })
        }
        return next
      })
    }, interval)
    return () => clearInterval(id)
  }, [auto, interval, banners.length])

  return (
    <div className="relative overflow-hidden rounded-lg border">
      <div ref={scrollerRef} className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth" style={{ height }}>
        {banners.map((b) => (
          <div key={b.id} className="relative min-w-full snap-center">
            <Image
              src={b.image_url || "/placeholder.svg?height=420&width=1200&query=trade%20logistics%20banner"}
              alt={b.title || "Banner"}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            {b.title ? <div className="absolute inset-0 bg-black/30" /> : null}
            {b.title ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-md bg-black/50 px-4 py-2 text-base font-medium text-white">{b.title}</div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {banners.map((_, i) => (
          <span key={i} className={cn("h-2 w-2 rounded-full bg-white/60", i === index && "bg-white")} />
        ))}
      </div>
    </div>
  )
}
