ALTER TABLE "product_sizes" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "product_sizes" CASCADE;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "price_tiers" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "sizes" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "colors" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "sale_type" text DEFAULT null;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "sale_value" integer;