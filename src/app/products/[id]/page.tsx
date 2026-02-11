// src/app/products/[id]/page.tsx
import { db } from "@/app/drizzle";
import { products } from "@/app/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = Number(id);
  if (isNaN(productId)) notFound();

  const [rawProduct] = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      base_price: products.basePrice,
      price_by_size: products.priceBySize,
      on_sale: products.onSale,
      sale_type: products.saleType,
      sale_value: products.saleValue,
      stock_by_size: products.stockBySize,
      category: products.category,
      sizes: products.sizes,
      colors: products.colors,
      images: products.images,
      is_active: products.isActive,
    })
    .from(products)
    .where(
      and(
        eq(products.id, productId),
        eq(products.isActive, true)
      )
    )
    .limit(1);

  if (!rawProduct) notFound();

  // Map snake_case DB fields to camelCase for client component
  const product = {
    id: rawProduct.id,
    name: rawProduct.name,
    description: rawProduct.description,
    basePrice: rawProduct.base_price,
    priceBySize: rawProduct.price_by_size,
    onSale: rawProduct.on_sale,
    saleType: rawProduct.sale_type,
    saleValue: rawProduct.sale_value,
    stockBySize: rawProduct.stock_by_size,
    category: rawProduct.category,
    sizes: rawProduct.sizes,
    colors: rawProduct.colors,
    images: rawProduct.images,
    isActive: rawProduct.is_active,
  };

  return <ProductDetailClient product={product} />;
}