CREATE TYPE "public"."PRODUCT_STATUS" AS ENUM('active', 'draft ', 'inactive');--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "status" "PRODUCT_STATUS" DEFAULT 'draft ' NOT NULL;