"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import {
  createBanner,
  createCategory,
  createProduct,
  createService,
  deleteOrder,
  updateOrderStatus,
  useAdminLists,
  updateProduct as updateProductAction,
  deleteProduct as deleteProductAction,
  updateCategory as updateCategoryAction,
  deleteCategory as deleteCategoryAction,
  updateBanner as updateBannerAction,
  deleteBanner as deleteBannerAction,
  updateService as updateServiceAction,
  deleteService as deleteServiceAction,
} from "../server-actions";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

async function uploadToStorage(file: File, folder: string) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder);
  try {
    const res = await fetch("/admin/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (json?.ok) return json;
    return { ok: false, error: json?.error || "Upload failed" };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Upload failed" };
  }
}

type EditState =
  | { type: "product"; item: any }
  | { type: "category"; item: any }
  | { type: "banner"; item: any }
  | { type: "service"; item: any }
  | null;

export function AdminDashboard() {
  const [pending, start] = useTransition();
  const { refresh, products, categories, banners, services, orders, error } =
    useAdminLists();

  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: 0,
    image_url: "",
    category_id: "",
  });
  const [category, setCategory] = useState({
    name: "",
    description: "",
    image_url: "",
  });
  const [banner, setBanner] = useState({ image_url: "", title: "" });
  const [service, setService] = useState({
    title: "",
    brief: "",
    description: "",
    image_url: "",
    slug: "",
  });

  const [edit, setEdit] = useState<EditState>(null);
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === openOrderId),
    [orders, openOrderId]
  );

  useEffect(() => {
    if (error)
      toast({
        title: "Supabase not configured",
        description: error,
        variant: "destructive",
      });
  }, [error]);

  const EditDialog = () => {
    if (!edit) return null;
    const { type, item } = edit;
    const onClose = () => setEdit(null);

    const save = async () => {
      if (type === "product") {
        const res = await updateProductAction({
          id: item.id,
          title: item.title,
          description: item.description,
          price: Number(item.price || 0),
          image_url: item.image_url || "",
          category_id: item.category_id || null,
        });
        if (!res.ok)
          return toast({
            title: "Failed",
            description: res.error,
            variant: "destructive",
          });
      } else if (type === "category") {
        const res = await updateCategoryAction({
          id: item.id,
          name: item.name,
          description: item.description,
          image_url: item.image_url || "",
        });
        if (!res.ok)
          return toast({
            title: "Failed",
            description: res.error,
            variant: "destructive",
          });
      } else if (type === "banner") {
        const res = await updateBannerAction({
          id: item.id,
          image_url: item.image_url,
          title: item.title || "",
        });
        if (!res.ok)
          return toast({
            title: "Failed",
            description: res.error,
            variant: "destructive",
          });
      } else if (type === "service") {
        const res = await updateServiceAction({
          id: item.id,
          title: item.title,
          brief: item.brief,
          description: item.description || "",
          image_url: item.image_url || "",
          slug: item.slug,
        });
        if (!res.ok)
          return toast({
            title: "Failed",
            description: res.error,
            variant: "destructive",
          });
      }
      toast({ title: "Saved" });
      setEdit(null);
      await refresh();
    };

    const upload = async (file: File, folder: string) => {
      const res = await uploadToStorage(file, folder);
      if (res.ok) {
        item.image_url = res.url;
        toast({ title: "Image uploaded" });
      } else {
        toast({
          title: "Upload failed",
          description: res.error,
          variant: "destructive",
        });
      }
    };

    return (
      <Dialog open={!!edit} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit {type}</DialogTitle>
            <DialogDescription>
              Update fields and save changes.
            </DialogDescription>
          </DialogHeader>

          {type === "product" && (
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input
                  value={item.title || ""}
                  onChange={(e) => (item.title = e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Price</Label>
                <Input
                  type="number"
                  min={0}
                  value={item.price ?? 0}
                  onChange={(e) => (item.price = Number(e.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                  value={item.description || ""}
                  onChange={(e) => (item.description = e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select
                  value={item.category_id || ""}
                  onValueChange={(val) => (item.category_id = val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) await upload(file, "products");
                  }}
                />
                {item.image_url && (
                  <div className="relative h-20 w-28 overflow-hidden rounded border bg-muted">
                    <Image
                      src={item.image_url || "/placeholder.svg"}
                      alt="preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {type === "category" && (
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input
                  value={item.name || ""}
                  onChange={(e) => (item.name = e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                  value={item.description || ""}
                  onChange={(e) => (item.description = e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) await upload(file, "categories");
                  }}
                />
                {item.image_url && (
                  <div className="relative h-20 w-28 overflow-hidden rounded border bg-muted">
                    <Image
                      src={item.image_url || "/placeholder.svg"}
                      alt="preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {type === "banner" && (
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input
                  value={item.title || ""}
                  onChange={(e) => (item.title = e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) await upload(file, "banners");
                  }}
                />
                {item.image_url && (
                  <div className="relative h-20 w-40 overflow-hidden rounded border bg-muted">
                    <Image
                      src={item.image_url || "/placeholder.svg"}
                      alt="preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {type === "service" && (
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input
                  value={item.title || ""}
                  onChange={(e) => (item.title = e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Slug</Label>
                <Input
                  value={item.slug || ""}
                  onChange={(e) => (item.slug = e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Brief</Label>
                <Textarea
                  value={item.brief || ""}
                  onChange={(e) => (item.brief = e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                  value={item.description || ""}
                  onChange={(e) => (item.description = e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) await upload(file, "services");
                  }}
                />
                {item.image_url && (
                  <div className="relative h-20 w-40 overflow-hidden rounded border bg-muted">
                    <Image
                      src={item.image_url || "/placeholder.svg"}
                      alt="preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button onClick={save} disabled={pending}>
              Save
            </Button>
            <Button variant="outline" onClick={() => setEdit(null)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      <EditDialog />
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        {/* PRODUCTS */}
        <TabsContent value="products" className="space-y-6">
          <div className="rounded-lg border p-4">
            <h2 className="mb-3 text-lg font-medium">Add Product</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input
                  value={product.title}
                  onChange={(e) =>
                    setProduct({ ...product, title: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Price</Label>
                <Input
                  type="number"
                  min={0}
                  value={product.price}
                  onChange={(e) =>
                    setProduct({ ...product, price: Number(e.target.value) })
                  }
                />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={product.description}
                  onChange={(e) =>
                    setProduct({ ...product, description: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label>Category</Label>
                <Select
                  value={product.category_id}
                  onValueChange={(val) =>
                    setProduct({ ...product, category_id: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const res = await uploadToStorage(file, "products");
                    if (res.ok) {
                      setProduct({ ...product, image_url: res.url });
                      toast({ title: "Image uploaded" });
                    } else {
                      toast({
                        title: "Upload failed",
                        description: res.error,
                        variant: "destructive",
                      });
                    }
                  }}
                />
                {product.image_url && (
                  <div className="relative h-20 w-28 overflow-hidden rounded border bg-muted">
                    <Image
                      src={product.image_url || "/placeholder.svg"}
                      alt="preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3">
              <Button
                disabled={pending}
                onClick={() =>
                  start(async () => {
                    if (!product.category_id) {
                      toast({
                        title: "Error",
                        description: "Category is required",
                        variant: "destructive",
                      });
                      return;
                    }

                    const res = await createProduct(product);
                    if (res.ok) {
                      toast({ title: "Product added" });
                      setProduct({
                        title: "",
                        description: "",
                        price: 0,
                        image_url: "",
                        category_id: "",
                      });
                      await refresh();
                    } else {
                      toast({
                        title: "Error",
                        description: res.error,
                        variant: "destructive",
                      });
                    }
                  })
                }
              >
                {pending ? "Saving..." : "Save Product"}
              </Button>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="mb-3 font-medium">Existing Products</h3>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <li
                  key={p.id}
                  className="rounded-md border p-3 text-sm hover:bg-accent/40 cursor-pointer"
                  onClick={() => setEdit({ type: "product", item: { ...p } })}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{p.title}</div>
                    <div className="text-muted-foreground">
                      ${Number(p.price).toFixed(2)}
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEdit({ type: "product", item: { ...p } });
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async (e) => {
                        e.stopPropagation();
                        const res = await deleteProductAction(p.id);
                        if (res.ok) {
                          toast({ title: "Deleted" });
                          await refresh();
                        } else
                          toast({
                            title: "Error",
                            description: res.error,
                            variant: "destructive",
                          });
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        {/* CATEGORIES */}
        <TabsContent value="categories" className="space-y-6">
          <div className="rounded-lg border p-4">
            <h2 className="mb-3 text-lg font-medium">Add Category</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input
                  value={category.name}
                  onChange={(e) =>
                    setCategory({ ...category, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={category.description}
                  onChange={(e) =>
                    setCategory({ ...category, description: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label>Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const res = await uploadToStorage(file, "categories");
                    if (res.ok) {
                      setCategory({ ...category, image_url: res.url });
                      toast({ title: "Image uploaded" });
                    } else {
                      toast({
                        title: "Upload failed",
                        description: res.error,
                        variant: "destructive",
                      });
                    }
                  }}
                />
                {category.image_url && (
                  <div className="relative h-20 w-28 overflow-hidden rounded border bg-muted">
                    <Image
                      src={category.image_url || "/placeholder.svg"}
                      alt="preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3">
              <Button
                disabled={pending}
                onClick={() =>
                  start(async () => {
                    if (!category.name.trim()) {
                      toast({
                        title: "Error",
                        description: "Name is required",
                        variant: "destructive",
                      });
                      return;
                    }

                    const res = await createCategory(category);
                    if (res.ok) {
                      toast({ title: "Category added" });
                      setCategory({ name: "", description: "", image_url: "" });
                      await refresh();
                    } else {
                      toast({
                        title: "Error",
                        description: res.error,
                        variant: "destructive",
                      });
                    }
                  })
                }
              >
                {pending ? "Saving..." : "Save Category"}
              </Button>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="mb-3 font-medium">Existing Categories</h3>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c) => (
                <li
                  key={c.id}
                  className="rounded-md border p-3 text-sm hover:bg-accent/40 cursor-pointer"
                  onClick={() => setEdit({ type: "category", item: { ...c } })}
                >
                  <div className="font-medium">{c.name}</div>
                  <div className="mt-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEdit({ type: "category", item: { ...c } });
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async (e) => {
                        e.stopPropagation();
                        const res = await deleteCategoryAction(c.id);
                        if (res.ok) {
                          toast({ title: "Deleted" });
                          await refresh();
                        } else
                          toast({
                            title: "Error",
                            description: res.error,
                            variant: "destructive",
                          });
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        {/* BANNERS */}
        <TabsContent value="banners" className="space-y-6">
          <div className="rounded-lg border p-4">
            <h2 className="mb-3 text-lg font-medium">Add Banner</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2 sm:col-span-2">
                <Label>Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const res = await uploadToStorage(file, "banners");
                    if (res.ok) {
                      setBanner({ ...banner, image_url: res.url });
                      toast({ title: "Image uploaded" });
                    } else {
                      toast({
                        title: "Upload failed",
                        description: res.error,
                        variant: "destructive",
                      });
                    }
                  }}
                />
                {banner.image_url && (
                  <div className="relative h-20 w-40 overflow-hidden rounded border bg-muted">
                    <Image
                      src={banner.image_url || "/placeholder.svg"}
                      alt="preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label>Title (optional)</Label>
                <Input
                  value={banner.title}
                  onChange={(e) =>
                    setBanner({ ...banner, title: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mt-3">
              <Button
                disabled={pending}
                onClick={() =>
                  start(async () => {
                    if (!banner.image_url) {
                      toast({
                        title: "Error",
                        description: "Category is required",
                        variant: "destructive",
                      });
                      return;
                    }

                    const res = await createBanner(banner);
                    if (res.ok) {
                      toast({ title: "Banner added" });
                      setBanner({ image_url: "", title: "" });
                      await refresh();
                    } else {
                      toast({
                        title: "Error",
                        description: res.error,
                        variant: "destructive",
                      });
                    }
                  })
                }
              >
                {pending ? "Saving..." : "Save Banner"}
              </Button>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="mb-3 font-medium">Existing Banners</h3>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {banners.map((b) => (
                <li
                  key={b.id}
                  className="rounded-md border p-3 text-sm hover:bg-accent/40 cursor-pointer"
                  onClick={() => setEdit({ type: "banner", item: { ...b } })}
                >
                  <div className="font-medium">{b.title || "Banner"}</div>
                  <div className="text-muted-foreground truncate">
                    {b.image_url}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEdit({ type: "banner", item: { ...b } });
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async (e) => {
                        e.stopPropagation();
                        const res = await deleteBannerAction(b.id);
                        if (res.ok) {
                          toast({ title: "Deleted" });
                          await refresh();
                        } else
                          toast({
                            title: "Error",
                            description: res.error,
                            variant: "destructive",
                          });
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        {/* SERVICES */}
        <TabsContent value="services" className="space-y-6">
          <div className="rounded-lg border p-4">
            <h2 className="mb-3 text-lg font-medium">Add Service</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input
                  value={service.title}
                  onChange={(e) =>
                    setService({ ...service, title: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Slug</Label>
                <Input
                  placeholder="e.g., customs-clearance"
                  value={service.slug}
                  onChange={(e) =>
                    setService({ ...service, slug: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label>Brief</Label>
                <Textarea
                  value={service.brief}
                  onChange={(e) =>
                    setService({ ...service, brief: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label>Full Description</Label>
                <Textarea
                  value={service.description}
                  onChange={(e) =>
                    setService({ ...service, description: e.target.value })
                  }
                  rows={8}
                />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label>Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const res = await uploadToStorage(file, "services");
                    if (res.ok) {
                      setService({ ...service, image_url: res.url });
                      toast({ title: "Image uploaded" });
                    } else {
                      toast({
                        title: "Upload failed",
                        description: res.error,
                        variant: "destructive",
                      });
                    }
                  }}
                />
                {service.image_url && (
                  <div className="relative h-20 w-40 overflow-hidden rounded border bg-muted">
                    <Image
                      src={service.image_url || "/placeholder.svg"}
                      alt="preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3">
              <Button
                disabled={pending}
                onClick={() =>
                  start(async () => {
                    if (!service.title) {
                      toast({
                        title: "Error",
                        description: "Category is required",
                        variant: "destructive",
                      });
                      return;
                    }

                    if (!service.brief) {
                      toast({
                        title: "Error",
                        description: "Category is required",
                        variant: "destructive",
                      });
                      return;
                    }

                    if (!service.description) {
                      toast({
                        title: "Error",
                        description: "Category is required",
                        variant: "destructive",
                      });
                      return;
                    }
                    const res = await createService(service);
                    if (res.ok) {
                      toast({ title: "Service added" });
                      setService({
                        title: "",
                        brief: "",
                        description: "",
                        image_url: "",
                        slug: "",
                      });
                      await refresh();
                    } else {
                      toast({
                        title: "Error",
                        description: res.error,
                        variant: "destructive",
                      });
                    }
                  })
                }
              >
                {pending ? "Saving..." : "Save Service"}
              </Button>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="mb-3 font-medium">Existing Services</h3>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <li
                  key={s.id}
                  className="rounded-md border p-3 text-sm hover:bg-accent/40 cursor-pointer"
                  onClick={() => setEdit({ type: "service", item: { ...s } })}
                >
                  <div className="font-medium">{s.title}</div>
                  <div className="text-muted-foreground line-clamp-2">
                    {s.brief}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEdit({ type: "service", item: { ...s } });
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async (e) => {
                        e.stopPropagation();
                        const res = await deleteServiceAction(s.id);
                        if (res.ok) {
                          toast({ title: "Deleted" });
                          await refresh();
                        } else
                          toast({
                            title: "Error",
                            description: res.error,
                            variant: "destructive",
                          });
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        {/* ORDERS */}
        <TabsContent value="orders" className="space-y-6">
          <div className="rounded-lg border p-4">
            <h2 className="mb-3 text-lg font-medium">Orders</h2>
            <ul className="grid gap-3">
              {orders.map((o) => (
                <li
                  key={o.id}
                  className="rounded-md border p-3 text-sm hover:bg-accent/40 cursor-pointer"
                  onClick={() => setOpenOrderId(o.id)}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="font-medium">
                      #{o.id.slice(0, 8)} • {o.customer_name} • $
                      {Number(o.total).toFixed(2)}
                    </div>
                    <div className="ml-auto text-xs uppercase">{o.status}</div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {o.customer_email} • {o.customer_phone}
                  </div>
                  <div className="mt-3 flex gap-2">
                    {o.status !== "processing" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={async (e) => {
                          e.stopPropagation();
                          await updateOrderStatus(o.id, "processing");
                          await refresh();
                        }}
                      >
                        Mark Processing
                      </Button>
                    )}
                    {o.status !== "completed" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={async (e) => {
                          e.stopPropagation();
                          await updateOrderStatus(o.id, "completed");
                          await refresh();
                        }}
                      >
                        Mark Completed
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async (e) => {
                        e.stopPropagation();
                        await deleteOrder(o.id);
                        await refresh();
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
              {orders.length === 0 && (
                <li className="text-sm text-muted-foreground">
                  No orders yet.
                </li>
              )}
            </ul>
          </div>

          <Dialog
            open={!!openOrderId}
            onOpenChange={(o) => !o && setOpenOrderId(null)}
          >
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Order details</DialogTitle>
              </DialogHeader>
              {selectedOrder ? (
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      #{selectedOrder.id.slice(0, 8)}
                    </div>
                    <div className="uppercase">{selectedOrder.status}</div>
                  </div>
                  <div>
                    <div className="font-medium">Customer</div>
                    <div className="text-muted-foreground">
                      {selectedOrder.customer_name} •{" "}
                      {selectedOrder.customer_email} •{" "}
                      {selectedOrder.customer_phone}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Shipping Address</div>
                    <div className="text-muted-foreground whitespace-pre-wrap">
                      {selectedOrder.shipping_address}
                    </div>
                  </div>
                  {selectedOrder.notes && (
                    <div>
                      <div className="font-medium">Notes</div>
                      <div className="text-muted-foreground whitespace-pre-wrap">
                        {selectedOrder.notes}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="font-medium">Items</div>
                    <ul className="mt-1 list-inside list-disc text-muted-foreground">
                      {(selectedOrder.items || []).map(
                        (i: any, idx: number) => (
                          <li key={idx}>
                            {i.title} x{i.qty} — ${Number(i.price).toFixed(2)}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2">
                    <div className="font-medium">Total</div>
                    <div className="font-semibold">
                      ${Number(selectedOrder.total).toFixed(2)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No order selected.
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}
