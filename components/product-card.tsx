"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "./cart-provider"

export type Product = {
  id: string
  title: string
  description?: string | null
  price: number
  image_url?: string | null
  category_id?: string | null
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const image = product.image_url || "/generic-product.png"
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="relative">
        <Link href={`/products/${product.id}`} className="group block">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-muted">
            <Image
              src={image || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </div>
          <CardTitle className="mt-3 text-base group-hover:underline">{product.title}</CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground line-clamp-2">{product.description}</CardContent>
      <CardFooter className="mt-auto flex items-center justify-between">
        <div className="font-semibold">${product.price.toFixed(2)}</div>
        <div className="flex gap-2">
          <Button asChild variant="secondary" size="sm">
            <Link href={`/products/${product.id}`}>Details</Link>
          </Button>
          <Button
            size="sm"
            onClick={() =>
              addItem({ id: product.id, title: product.title, price: product.price, image_url: product.image_url })
            }
          >
            Add to cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
