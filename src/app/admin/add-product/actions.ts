// src/app/actions.ts
"use server";

import { db } from "@/app/drizzle";
import { products } from "@/app/drizzle/schema";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

// Add new product
export async function addProduct(formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const basePrice = formData.get("basePrice") as string; // text, e.g. "$29.99" or "Market Price"

  const category = formData.get("category") as string;
  const sizes = JSON.parse(formData.get("sizes") as string || "[]");
  const colors = JSON.parse(formData.get("colors") as string || "[]");
  const images = JSON.parse(formData.get("images") as string || "[]");

  // Per-size price overrides (upcharges)
  const priceBySizeRaw = formData.get("priceBySize") as string;
  const priceBySize = priceBySizeRaw ? JSON.parse(priceBySizeRaw) : {};

  // Stock per size
  const stockBySizeRaw = formData.get("stockBySize") as string;
  const stockBySize = stockBySizeRaw ? JSON.parse(stockBySizeRaw) : {};

  // Sale / discount
  const onSale = formData.get("onSale") === "true";
  const saleType = onSale ? (formData.get("saleType") as "percentage" | "flat") : null;
  const saleValue = onSale ? (formData.get("saleValue") as string) : null;

  await db.insert(products).values({
    name,
    description,
    basePrice,
    priceBySize,
    stockBySize,
    onSale,
    saleType,
    saleValue,
    category,
    sizes,
    colors,
    images,
  });

  revalidatePath("/admin");
  revalidatePath("/");

  return { success: true };
}