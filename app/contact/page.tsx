"use client";

import type React from "react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Clock, MessageSquare, Globe } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <h1 className="mb-6 text-2xl font-semibold">Contact Us</h1>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Info */}
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="mb-2 text-sm font-semibold">Head Office</div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4" />
                    <span>
                      Head Office – Dinar Trading Company United Arab Emirates –
                      Dubai Deira, Dubai – Hor Al Anz NOORANIYAH Building P.O.
                      Box: 40218
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
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {sent ? (
                <div className="rounded-md border bg-muted p-6 text-sm">
                  Thanks for reaching out. We will contact you shortly.
                </div>
              ) : (
                <form className="grid gap-3" onSubmit={onSubmit}>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={form.subject}
                      onChange={(e) =>
                        setForm({ ...form, subject: e.target.value })
                      }
                      placeholder="Inquiry about customs clearance service"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      rows={8}
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Button type="submit">Send Message</Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
