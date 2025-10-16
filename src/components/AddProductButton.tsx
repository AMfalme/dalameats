"use client";

import { useState } from "react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function AddProductButton() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: 0,
    imageUrl: "",
    description: "",
    isAvailable: true,
    stock: 0,
    unit: "pcs",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct = {
      ...form,
      id: crypto.randomUUID(),
      salesCount: 0,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    console.log("Product added:", newProduct);

    // TODO: add Firebase/DB save logic here
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarMenuButton
          tooltip="Add Product"
          onClick={() => setOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/90 min-w-8 duration-200 ease-linear"
        >
          <IconCirclePlusFilled />
          <span>Add Product</span>
        </SidebarMenuButton>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="unit">Unit</Label>
            <Input name="unit" value={form.unit} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input name="imageUrl" value={form.imageUrl} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isAvailable">Available</Label>
            {/* <Switch
              checked={form.isAvailable}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, isAvailable: checked }))
              }
            /> */}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
