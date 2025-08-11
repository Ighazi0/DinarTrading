"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "./cart-provider"

export function AddToCartButton(props: {
  product: { id: string; title: string; price: number; image_url?: string | null }
}) {
  const { addItem } = useCart()
  return (
    <Button
      onClick={() =>
        addItem({
          id: props.product.id,
          title: props.product.title,
          price: props.product.price,
          image_url: props.product.image_url,
        })
      }
    >
      Add to cart
    </Button>
  )
}
