import { pgTable, serial, text, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  basePrice: text("base_price").notNull(), // now text: "$29.99" or "Market Price"
  priceBySize: jsonb("price_by_size").$type<Record<string, string>>().default({}), // { "XXL": "$34.99", "XXXL": "$39.99" }
  onSale: boolean("on_sale").default(false),
  saleType: text("sale_type").$type<"percentage" | "flat" | null>().default(null),
  saleValue: text("sale_value").default("0"), // text now, e.g. "20" for 20% or "5" for $5
  stockBySize: jsonb("stock_by_size").$type<Record<string, number>>().notNull().default({}),
  category: text("category").notNull(),
  sizes: jsonb("sizes").$type<string[]>().notNull().default([]),
  colors: jsonb("colors").$type<string[]>().notNull().default([]),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
