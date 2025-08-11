"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCart } from "./cart-provider";
import { OrderSheet } from "./order-sheet";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Our Services" },
  { href: "/products", label: "Our Products" },
  { href: "/shop", label: "Shop Now" },
  { href: "/contact", label: "Contact Us" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { totalQty } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-3 px-4 md:px-6">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden bg-transparent"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative h-12 w-12 overflow-hidden rounded">
                <Image
                  src="/images/logo.png"
                  alt="Dinar Trading CO.(L.L.C.) logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-base sm:text-lg font-semibold">
                Dinar Trading CO.(L.L.C.)
              </span>
            </div>
            <nav className="grid gap-2">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-base font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === l.href && "bg-accent text-accent-foreground"
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 font-semibold">
          <div className="relative h-12 w-12 overflow-hidden rounded">
            <Image
              src="/images/logo.png"
              alt="Dinar Trading CO.(L.L.C.) logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-base sm:text-lg">
            Dinar Trading CO.(L.L.C.)
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="ml-4 hidden gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground",
                pathname === l.href && "text-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Cart */}
        <div className="ml-auto flex items-center gap-2">
          <OrderSheet>
            <Button
              variant="outline"
              size="sm"
              className="relative bg-transparent"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart
              {totalQty > 0 && (
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {totalQty}
                </span>
              )}
            </Button>
          </OrderSheet>
        </div>
      </div>
    </header>
  );
}
