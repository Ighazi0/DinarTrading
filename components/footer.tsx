import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Clock,
} from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <div className="text-lg font-semibold">
              Dinar Trading CO.(L.L.C.)
            </div>
            <p className="text-sm text-muted-foreground">
              General trade, import & export, supply, shipping, customs
              clearance, and end-to-end logistics solutions across global
              markets.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link
                aria-label="LinkedIn"
                href="https://www.linkedin.com"
                className="text-muted-foreground hover:text-foreground"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                aria-label="Facebook"
                href="https://www.facebook.com"
                className="text-muted-foreground hover:text-foreground"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                aria-label="Instagram"
                href="https://www.instagram.com"
                className="text-muted-foreground hover:text-foreground"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="mb-3 text-sm font-semibold">Quick Links</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link className="hover:underline" href="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="hover:underline" href="/about">
                  About Us
                </Link>
              </li>
              <li>
                <Link className="hover:underline" href="/services">
                  Our Services
                </Link>
              </li>
              <li>
                <Link className="hover:underline" href="/products">
                  Our Products
                </Link>
              </li>
              <li>
                <Link className="hover:underline" href="/shop">
                  Shop Now
                </Link>
              </li>
              <li>
                <Link className="hover:underline" href="/contact">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="mb-3 text-sm font-semibold">Contact</div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4" />
                <span>
                  Head Office – Dinar Trading Company United Arab Emirates –
                  Dubai Deira, Dubai
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a className="hover:underline" href="tel:+971500000000">
                  00971528361811
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a
                  className="hover:underline"
                  href="mailto:info@dinartrading.co"
                >
                  info@dinartrading.co
                </a>
              </li>
            </ul>
          </div>

          {/* More */}
          <div>
            <div className="mb-3 text-sm font-semibold">
              Logistics Solutions
            </div>
            <p className="text-sm text-muted-foreground">
              Freight forwarding, warehousing, customs brokerage, last‑mile
              delivery, and supply chain optimization.
            </p>
            <div className="mt-3 text-sm">
              <Link href="/services" className="text-primary hover:underline">
                Explore services →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-4 text-sm text-muted-foreground">
          <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
            <div>
              {"© "}
              {new Date().getFullYear()} Dinar Trading CO.(L.L.C.). All rights
              reserved.
            </div>
            <div className="flex gap-4">
              <Link href="#" className="hover:underline">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:underline">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
