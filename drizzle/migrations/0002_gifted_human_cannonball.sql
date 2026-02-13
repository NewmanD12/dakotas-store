ALTER TABLE "products" ALTER COLUMN "base_price" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "base_price" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "sale_value" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "sale_value" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "price_by_size" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "on_sale" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "stock_by_size" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "price_tiers";