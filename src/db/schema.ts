import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  basePrice: integer('base_price').notNull(), // in cents
  category: text('category').notNull(),
  mainImageUrl: text('main_image_url'),
  sku: text('sku'), // optional
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

export const productVariants = pgTable('product_variants', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  size: text('size').notNull(),
  priceOverride: integer('price_override'),
  stock: integer('stock').notNull().default(0),
  sku: text('sku').unique(),
  variantImageUrl: text('variant_image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});